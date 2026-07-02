(function () {
  const e = React.createElement;
  const emptyForm = {
    companyName: "",
    oib: "",
    contactName: "",
    phone: "",
    email: "",
    notes: ""
  };
  const MEETING_STATUS = {
    agreed: { label: "Dogovoreno", className: "status-agreed" },
    cancelled: { label: "Odustajemo", className: "status-cancelled" },
    follow_up: { label: "Nastavak", className: "status-follow-up" }
  };
  const DURATION_LABELS = { "30m": "30 min", "1h": "1 h", "2h": "2 h", "as_needed": "Po potrebi" };
  const REMINDER_OFFSET_LABELS = { "1h": "1 h ranije", "5h": "5 h ranije", "1d": "1 dan ranije" };

  async function api(path, options) {
    const response = await fetch("api/" + path, {
      credentials: "same-origin",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options && options.headers ? options.headers : {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      window.location.replace("login.html");
      throw new Error("Potrebna je prijava.");
    }
    if (!response.ok) {
      throw new Error(data.message || "Zahtjev nije uspio.");
    }
    return data;
  }

  function Brand() {
    return e("a", { className: "portal-brand compact", href: "portal.html", "aria-label": "Početna stranica portala" },
      e("img", { src: "logo3_small.png", alt: "", width: 50, height: 50 }),
      e("span", null,
        e("strong", null, "NOVARIS"),
        e("small", null, "TECH")
      )
    );
  }

  function Sidebar({ onLogout, user, activeSection, onNavigate }) {
    return e("aside", { className: "portal-sidebar" },
      e(Brand),
      e("nav", { className: "portal-nav", "aria-label": "Glavna navigacija" },
        e("button", {
          type: "button",
          className: activeSection === "dashboard" ? "active" : "",
          onClick: () => onNavigate("dashboard")
        },
          e("span", { "aria-hidden": "true" }, "⌂"),
          "Početna"
        ),
        e("button", {
          type: "button",
          className: activeSection === "clients" ? "active" : "",
          onClick: () => onNavigate("clients")
        },
          e("span", { "aria-hidden": "true" }, "◫"),
          "Klijenti"
        ),
        e("button", {
          type: "button",
          className: activeSection === "planning" ? "active" : "",
          onClick: () => onNavigate("planning")
        },
          e("span", { "aria-hidden": "true" }, "◷"),
          "Planiranje"
        )
      ),
      e("div", { className: "sidebar-bottom" },
        e("div", { className: "signed-in-user" },
          e("span", { className: "avatar" }, "A"),
          e("span", null,
            e("strong", null, user ? user.name : "Administrator"),
            e("small", null, user ? user.email : "info@novaristech.hr")
          )
        ),
        e("button", { type: "button", className: "logout-button", onClick: onLogout }, "Odjava")
      )
    );
  }

  function ClientForm({ onClose, onSave }) {
    const [form, setForm] = React.useState(emptyForm);
    const [error, setError] = React.useState("");

    function update(event) {
      const { name, value } = event.target;
      setForm((current) => ({ ...current, [name]: value }));
    }

    async function submit(event) {
      event.preventDefault();
      if (!form.companyName.trim() || !form.oib.trim() || !form.contactName.trim() || !form.email.trim()) {
        setError("Ispunite naziv tvrtke, OIB, kontakt osobu i email.");
        return;
      }
      if (!/^\d{11}$/.test(form.oib.trim())) {
        setError("OIB mora sadržavati točno 11 znamenki.");
        return;
      }
      setError("");
      try {
        await onSave(form);
      } catch (saveError) {
        setError(saveError.message);
      }
    }

    return e("div", { className: "modal-backdrop", onMouseDown: (event) => event.target === event.currentTarget && onClose() },
      e("section", { className: "client-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "client-form-title" },
        e("div", { className: "modal-heading" },
          e("div", null,
            e("span", { className: "eyebrow" }, "Novi zapis"),
            e("h2", { id: "client-form-title" }, "Dodaj klijenta"),
            e("p", null, "Unesite osnovne podatke i kontakt osobe tvrtke.")
          ),
          e("button", { type: "button", className: "modal-close", onClick: onClose, "aria-label": "Zatvori" }, "×")
        ),
        e("form", { className: "client-form", onSubmit: submit },
          e("div", { className: "form-field full" },
            e("label", { htmlFor: "companyName" }, "Ime tvrtke *"),
            e("input", { id: "companyName", name: "companyName", value: form.companyName, onChange: update, placeholder: "npr. Novaris d.o.o.", autoFocus: true })
          ),
          e("div", { className: "form-field" },
            e("label", { htmlFor: "oib" }, "OIB *"),
            e("input", { id: "oib", name: "oib", value: form.oib, onChange: update, inputMode: "numeric", maxLength: 11, placeholder: "12345678901" })
          ),
          e("div", { className: "form-field" },
            e("label", { htmlFor: "contactName" }, "Kontakt ime i prezime *"),
            e("input", { id: "contactName", name: "contactName", value: form.contactName, onChange: update, placeholder: "Ime Prezime" })
          ),
          e("div", { className: "form-field" },
            e("label", { htmlFor: "phone" }, "Telefon"),
            e("input", { id: "phone", name: "phone", type: "tel", value: form.phone, onChange: update, placeholder: "+385 91 234 5678" })
          ),
          e("div", { className: "form-field" },
            e("label", { htmlFor: "clientEmail" }, "Email *"),
            e("input", { id: "clientEmail", name: "email", type: "email", value: form.email, onChange: update, placeholder: "kontakt@tvrtka.hr" })
          ),
          e("div", { className: "form-field full" },
            e("label", { htmlFor: "notes" }, "Bilješke"),
            e("textarea", { id: "notes", name: "notes", value: form.notes, onChange: update, placeholder: "Dodatne informacije o klijentu..." })
          ),
          error && e("p", { className: "form-error full", role: "alert" }, error),
          e("div", { className: "modal-actions full" },
            e("button", { type: "button", className: "portal-secondary", onClick: onClose }, "Odustani"),
            e("button", { type: "submit", className: "portal-primary" }, "Spremi klijenta")
          )
        )
      )
    );
  }

  function ClientsTable({ clients }) {
    if (!clients.length) {
      return e("div", { className: "clients-empty" },
        e("span", { "aria-hidden": "true" }, "＋"),
        e("h3", null, "Još nema klijenata"),
        e("p", null, "Dodajte prvog klijenta kako biste ovdje vidjeli njegove podatke.")
      );
    }

    return e("div", { className: "clients-table-wrap" },
      e("table", { className: "clients-table" },
        e("thead", null,
          e("tr", null,
            e("th", null, "Tvrtka"),
            e("th", null, "OIB"),
            e("th", null, "Kontakt osoba"),
            e("th", null, "Kontakt"),
            e("th", null, "Bilješke")
          )
        ),
        e("tbody", null,
          clients.map((client) =>
            e("tr", { key: client.id },
              e("td", null,
                e("div", { className: "company-cell" },
                  e("span", null, client.company_name.charAt(0).toUpperCase()),
                  e("strong", null, client.company_name)
                )
              ),
              e("td", { className: "mono" }, client.oib),
              e("td", null, client.contact_name),
              e("td", null,
                e("a", { href: "mailto:" + client.email }, client.email),
                client.phone && e("small", null, client.phone)
              ),
              e("td", { className: "notes-cell" }, client.notes || "—")
            )
          )
        )
      )
    );
  }

  function MeetingForm({ clients, meeting, onClose, onSave }) {
    const today = new Date().toISOString().slice(0, 10);
    const isEditing = Boolean(meeting);
    const [form, setForm] = React.useState(() => meeting ? {
      id: meeting.id,
      date: meeting.meeting_date,
      time: String(meeting.meeting_time).slice(0, 5),
      duration: meeting.duration,
      clientId: String(meeting.client_id),
      reminderEnabled: Number(meeting.reminder_enabled) === 1,
      reminderOffset: meeting.reminder_offset || "1h",
      clientReminderEnabled: Number(meeting.client_reminder_enabled) === 1,
      clientReminderOffset: meeting.client_reminder_offset || "1h",
      notes: meeting.meeting_notes || ""
    } : {
      date: today,
      time: "",
      duration: "30m",
      clientId: "",
      reminderEnabled: false,
      reminderOffset: "1h",
      clientReminderEnabled: false,
      clientReminderOffset: "1h",
      notes: ""
    });
    const [error, setError] = React.useState("");
    const [saving, setSaving] = React.useState(false);
    const selectedClient = clients.find((client) => String(client.id) === form.clientId);

    async function submit(event) {
      event.preventDefault();
      if (!form.clientId || !form.date || !form.time) {
        setError("Odaberite datum, vrijeme i tvrtku.");
        return;
      }
      setError("");
      setSaving(true);
      try {
        await onSave(form);
      } catch (saveError) {
        setError(saveError.message);
      } finally {
        setSaving(false);
      }
    }

    return e("div", { className: "modal-backdrop", onMouseDown: (event) => event.target === event.currentTarget && onClose() },
      e("section", { className: "client-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "meeting-form-title" },
        e("div", { className: "modal-heading" },
          e("div", null,
            e("span", { className: "eyebrow" }, isEditing ? "Izmjena zapisa" : "Novi zapis"),
            e("h2", { id: "meeting-form-title" }, isEditing ? "Uredi sastanak" : "Novi sastanak"),
            e("p", null, isEditing ? "Promijenite termin ili podatke sastanka." : "Odaberite termin i klijenta.")
          ),
          e("button", { type: "button", className: "modal-close", onClick: onClose, "aria-label": "Zatvori" }, "×")
        ),
        e("form", { className: "client-form", onSubmit: submit },
          e("div", { className: "form-field" },
            e("label", { htmlFor: "meetingDate" }, "Datum"),
            e("input", {
              id: "meetingDate",
              type: "date",
              min: today,
              value: form.date,
              onChange: (event) => setForm((current) => ({ ...current, date: event.target.value }))
            })
          ),
          e("div", { className: "form-field" },
            e("label", { htmlFor: "meetingTime" }, "Početak sastanka"),
            e("input", {
              id: "meetingTime",
              type: "time",
              value: form.time,
              onChange: (event) => setForm((current) => ({ ...current, time: event.target.value }))
            })
          ),
          e("div", { className: "form-field full" },
            e("label", { htmlFor: "meetingDuration" }, "Trajanje"),
            e("select", {
              id: "meetingDuration",
              value: form.duration,
              onChange: (event) => setForm((current) => ({ ...current, duration: event.target.value }))
            },
              e("option", { value: "30m" }, "30 min"),
              e("option", { value: "1h" }, "1 h"),
              e("option", { value: "2h" }, "2 h"),
              e("option", { value: "as_needed" }, "Po potrebi")
            )
          ),
          e("div", { className: "form-field full" },
            e("label", { htmlFor: "meetingClient" }, "Tvrtka"),
            e("select", {
              id: "meetingClient",
              value: form.clientId,
              onChange: (event) => setForm((current) => ({ ...current, clientId: event.target.value }))
            },
              e("option", { value: "" }, clients.length ? "Odaberite tvrtku" : "Prvo dodajte klijenta"),
              clients.map((client) => e("option", { key: client.id, value: client.id }, client.company_name))
            )
          ),
          selectedClient && e("div", { className: "selected-client-card full" },
            e("div", { className: "selected-client-heading" },
              e("span", null, selectedClient.company_name.charAt(0).toUpperCase()),
              e("div", null,
                e("strong", null, selectedClient.company_name),
                e("small", null, "OIB: " + selectedClient.oib)
              )
            ),
            e("dl", null,
              e("div", null, e("dt", null, "Kontakt osoba"), e("dd", null, selectedClient.contact_name)),
              e("div", null, e("dt", null, "Telefon"), e("dd", null, selectedClient.phone || "—")),
              e("div", null, e("dt", null, "Email"), e("dd", null, selectedClient.email)),
              e("div", { className: "full" }, e("dt", null, "Bilješke"), e("dd", null, selectedClient.notes || "—"))
            )
          ),
          e("div", { className: "form-field full" },
            e("label", { htmlFor: "meetingNotes" }, "Bilješke (informacija za klijenta i administratora)"),
            e("textarea", {
              id: "meetingNotes",
              value: form.notes,
              onChange: (event) => setForm((current) => ({ ...current, notes: event.target.value })),
              placeholder: "Tema sastanka, link za Teams sastanak ili dodatne informacije..."
            })
          ),
          e("div", { className: "reminder-control full" },
            e("label", { className: "toggle-row" },
              e("input", {
                type: "checkbox",
                checked: form.reminderEnabled,
                onChange: (event) => setForm((current) => ({ ...current, reminderEnabled: event.target.checked }))
              }),
              e("span", { className: "toggle-switch", "aria-hidden": "true" }),
              e("span", { className: "toggle-copy" },
                e("strong", null, "Obavijesti me ranije"),
                e("small", null, "Email za podsjetnik: info@novaristech.hr")
              )
            ),
            form.reminderEnabled && e("div", { className: "reminder-options", role: "group", "aria-label": "Vrijeme podsjetnika" },
              [
                ["1h", "1 h"],
                ["5h", "5 h"],
                ["1d", "1 dan"]
              ].map(([value, label]) =>
                e("label", { key: value, className: form.reminderOffset === value ? "selected" : "" },
                  e("input", {
                    type: "radio",
                    name: "reminderOffset",
                    value,
                    checked: form.reminderOffset === value,
                    onChange: () => setForm((current) => ({ ...current, reminderOffset: value }))
                  }),
                  label
                )
              )
            )
          ),
          e("div", { className: "reminder-control full" },
            e("label", { className: "toggle-row" },
              e("input", {
                type: "checkbox",
                checked: form.clientReminderEnabled,
                onChange: (event) => setForm((current) => ({ ...current, clientReminderEnabled: event.target.checked }))
              }),
              e("span", { className: "toggle-switch", "aria-hidden": "true" }),
              e("span", { className: "toggle-copy" },
                e("strong", null, "Obavijesti klijenta ranije"),
                e("small", null, selectedClient ? "Email za podsjetnik: " + selectedClient.email : "Odaberite tvrtku za email klijenta")
              )
            ),
            form.clientReminderEnabled && e("div", { className: "reminder-options", role: "group", "aria-label": "Vrijeme podsjetnika klijentu" },
              [
                ["1h", "1 h"],
                ["5h", "5 h"],
                ["1d", "1 dan"]
              ].map(([value, label]) =>
                e("label", { key: value, className: form.clientReminderOffset === value ? "selected" : "" },
                  e("input", {
                    type: "radio",
                    name: "clientReminderOffset",
                    value,
                    checked: form.clientReminderOffset === value,
                    onChange: () => setForm((current) => ({ ...current, clientReminderOffset: value }))
                  }),
                  label
                )
              )
            )
          ),
          error && e("p", { className: "form-error full", role: "alert" }, error),
          e("div", { className: "modal-actions full" },
            e("button", { type: "button", className: "portal-secondary", onClick: onClose }, "Odustani"),
            e("button", { type: "submit", className: "portal-primary", disabled: saving || !clients.length },
              saving ? "Spremanje..." : (isEditing ? "Spremi promjene" : "Spremi sastanak")
            )
          )
        )
      )
    );
  }

  function MeetingCard({ meeting, onEdit, onComplete }) {
    const [completing, setCompleting] = React.useState(false);
    const [outcomeNotes, setOutcomeNotes] = React.useState(meeting.outcome_notes || "");
    const [savingStatus, setSavingStatus] = React.useState(false);
    const [statusError, setStatusError] = React.useState("");
    const statusMeta = MEETING_STATUS[meeting.status];

    async function chooseStatus(status) {
      setStatusError("");
      setSavingStatus(true);
      try {
        await onComplete(meeting.id, status, outcomeNotes);
        setCompleting(false);
      } catch (error) {
        setStatusError(error.message);
      } finally {
        setSavingStatus(false);
      }
    }

    return e("article", { className: "meeting-card", key: meeting.id },
      e("div", { className: "meeting-date" },
        e("strong", null, new Date(meeting.meeting_date + "T00:00:00").toLocaleDateString("hr-HR", { day: "2-digit", month: "short" })),
        e("span", null, String(meeting.meeting_time).slice(0, 5)),
        e("small", null, DURATION_LABELS[meeting.duration] || meeting.duration)
      ),
      e("div", { className: "meeting-client" },
        e("h3", null, meeting.company_name),
        e("p", null, meeting.contact_name + " · " + meeting.email),
        meeting.phone && e("small", null, meeting.phone),
        meeting.meeting_notes && e("p", { className: "meeting-notes" }, meeting.meeting_notes),
        Number(meeting.reminder_enabled) === 1 && e("span", { className: "reminder-badge" },
          "Podsjetnik: " + (REMINDER_OFFSET_LABELS[meeting.reminder_offset] || meeting.reminder_offset)
        ),
        Number(meeting.client_reminder_enabled) === 1 && e("span", { className: "reminder-badge" },
          "Klijent: " + (REMINDER_OFFSET_LABELS[meeting.client_reminder_offset] || meeting.client_reminder_offset)
        ),
        statusMeta && e("span", { className: "status-badge " + statusMeta.className }, statusMeta.label),
        statusMeta && meeting.outcome_notes && e("p", { className: "meeting-notes" }, meeting.outcome_notes)
      ),
      e("div", { className: "meeting-actions" },
        e("button", {
          type: "button",
          className: "meeting-complete",
          onClick: () => setCompleting((current) => !current)
        }, statusMeta ? "Promijeni ishod" : "Završen sastanak"),
        e("button", { type: "button", className: "meeting-delay", onClick: () => onEdit(meeting) }, "Odgodi sastanak")
      ),
      completing && e("div", { className: "meeting-complete-panel" },
        e("label", { htmlFor: "outcome-" + meeting.id }, "Bilješka o ishodu"),
        e("textarea", {
          id: "outcome-" + meeting.id,
          value: outcomeNotes,
          onChange: (event) => setOutcomeNotes(event.target.value),
          placeholder: "Upišite nešto o ishodu sastanka..."
        }),
        statusError && e("p", { className: "form-error", role: "alert" }, statusError),
        e("div", { className: "status-options" },
          e("button", {
            type: "button",
            className: "status-choice status-agreed",
            disabled: savingStatus,
            onClick: () => chooseStatus("agreed")
          }, "Dogovoreno"),
          e("button", {
            type: "button",
            className: "status-choice status-cancelled",
            disabled: savingStatus,
            onClick: () => chooseStatus("cancelled")
          }, "Odustajemo"),
          e("button", {
            type: "button",
            className: "status-choice status-follow-up",
            disabled: savingStatus,
            onClick: () => chooseStatus("follow_up")
          }, "Nastavak")
        )
      )
    );
  }

  function PlanningSection({ clients, meetings, formOpen, editingMeeting, onOpenForm, onCloseForm, onSaveMeeting, onCompleteMeeting }) {
    return e(React.Fragment, null,
      e("header", { className: "portal-header" },
        e("div", null,
          e("span", { className: "eyebrow" }, "Poslovni portal"),
          e("h1", null, "Planiranje"),
          e("p", null, "Planirajte sastanke s postojećim klijentima.")
        ),
        e("button", { type: "button", className: "portal-primary add-client", onClick: () => onOpenForm() },
          e("span", { "aria-hidden": "true" }, "+"),
          "Novi sastanak"
        )
      ),
      e("section", { className: "planning-layout" },
        e("section", { className: "meetings-panel" },
          e("div", { className: "panel-title" },
            e("div", null,
              e("h2", null, "Planirani sastanci"),
              e("p", null, meetings.length + (meetings.length === 1 ? " sastanak" : " sastanaka"))
            )
          ),
          meetings.length === 0
            ? e("div", { className: "meetings-empty" },
                e("span", null, "◷"),
                e("h3", null, "Nema planiranih sastanaka"),
                e("p", null, "Novi sastanci pojavit će se ovdje.")
              )
            : e("div", { className: "meeting-list" },
                meetings.map((meeting) =>
                  e(MeetingCard, {
                    key: meeting.id,
                    meeting,
                    onEdit: onOpenForm,
                    onComplete: onCompleteMeeting
                  })
                )
              )
        )
      ),
      formOpen && e(MeetingForm, {
        clients,
        meeting: editingMeeting,
        onClose: onCloseForm,
        onSave: onSaveMeeting
      })
    );
  }

  function DashboardSection({ clients, meetings }) {
    const plannedMeetingsList = meetings.filter((meeting) => !MEETING_STATUS[meeting.status]);
    const completedMeetingsList = meetings.filter((meeting) => MEETING_STATUS[meeting.status]);
    const plannedMeetings = plannedMeetingsList.length;
    const completedMeetings = completedMeetingsList.length;
    const totalMeetings = meetings.length;
    const circleLength = 264;

    const statusSegments = [
      { key: "planned", label: "Planirano", color: "var(--blue)", count: plannedMeetings },
      { key: "agreed", label: "Dogovoreno", color: "#2fae6b", count: meetings.filter((m) => m.status === "agreed").length },
      { key: "follow_up", label: "Nastavak", color: "#e0a530", count: meetings.filter((m) => m.status === "follow_up").length },
      { key: "cancelled", label: "Odustajemo", color: "#e0524a", count: meetings.filter((m) => m.status === "cancelled").length }
    ].filter((segment) => segment.count > 0);

    let cumulativeOffset = 0;
    const donutSegments = statusSegments.map((segment) => {
      const length = totalMeetings ? (segment.count / totalMeetings) * circleLength : 0;
      const rendered = { ...segment, length, offset: cumulativeOffset };
      cumulativeOffset += length;
      return rendered;
    });

    const monthLabels = [];
    const monthlyCounts = [];
    const currentMonth = new Date();
    currentMonth.setDate(1);

    for (let index = 0; index < 6; index++) {
      const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + index, 1);
      monthLabels.push(month.toLocaleDateString("hr-HR", { month: "short" }).replace(".", ""));
      monthlyCounts.push(meetings.filter((meeting) => {
        const meetingDate = new Date(meeting.meeting_date + "T00:00:00");
        return meetingDate.getFullYear() === month.getFullYear() && meetingDate.getMonth() === month.getMonth();
      }).length);
    }

    const maxMonthlyCount = Math.max(1, ...monthlyCounts);

    return e(React.Fragment, null,
      e("header", { className: "portal-header dashboard-header" },
        e("div", null,
          e("span", { className: "eyebrow" }, "Novaris poslovni portal"),
          e("h1", null, "Pregled poslovanja"),
          e("p", null, "Brzi pregled klijenata i planiranih sastanaka.")
        ),
        e("span", { className: "dashboard-date" },
          new Date().toLocaleDateString("hr-HR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
        )
      ),
      e("section", { className: "dashboard-stats", "aria-label": "Poslovni sažetak" },
        e("article", { className: "dashboard-stat clients" },
          e("span", { className: "dashboard-stat-icon", "aria-hidden": "true" }, "◫"),
          e("div", null,
            e("small", null, "Broj klijenata"),
            e("strong", null, clients.length),
            e("p", null, "Ukupno aktivnih zapisa")
          )
        ),
        e("article", { className: "dashboard-stat planned" },
          e("span", { className: "dashboard-stat-icon", "aria-hidden": "true" }, "◷"),
          e("div", null,
            e("small", null, "Planirano"),
            e("strong", null, plannedMeetings),
            e("p", null, "Nadolazećih sastanaka")
          )
        ),
        e("article", { className: "dashboard-stat completed" },
          e("span", { className: "dashboard-stat-icon", "aria-hidden": "true" }, "✓"),
          e("div", null,
            e("small", null, "Završeno"),
            e("strong", null, completedMeetings),
            e("p", null, "Pripremljeno za praćenje")
          )
        )
      ),
      e("section", { className: "dashboard-charts" },
        e("article", { className: "dashboard-panel meeting-overview" },
          e("div", { className: "dashboard-panel-heading" },
            e("div", null,
              e("h2", null, "Status sastanaka"),
              e("p", null, "Omjer planiranih i završenih")
            )
          ),
          e("div", { className: "donut-layout" },
            e("div", { className: "donut-chart" },
              e("svg", { viewBox: "0 0 100 100", role: "img", "aria-label": "Status sastanaka po kategorijama" },
                e("circle", { cx: 50, cy: 50, r: 42, className: "donut-track" }),
                donutSegments.map((segment) =>
                  e("circle", {
                    key: segment.key,
                    cx: 50,
                    cy: 50,
                    r: 42,
                    style: { stroke: segment.color },
                    strokeDasharray: segment.length + " " + (circleLength - segment.length),
                    strokeDashoffset: -segment.offset
                  })
                )
              ),
              e("div", null,
                e("strong", null, totalMeetings),
                e("small", null, "sastanaka")
              )
            ),
            e("div", { className: "chart-legend" },
              statusSegments.map((segment) =>
                e("div", { key: segment.key },
                  e("span", { className: "legend-dot", style: { background: segment.color } }),
                  e("p", null, e("strong", null, segment.count), e("small", null, segment.label))
                )
              )
            )
          )
        ),
        e("article", { className: "dashboard-panel monthly-overview" },
          e("div", { className: "dashboard-panel-heading" },
            e("div", null,
              e("h2", null, "Nadolazeći sastanci"),
              e("p", null, "Planirano kroz sljedećih šest mjeseci")
            )
          ),
          e("div", { className: "bar-chart", role: "img", "aria-label": "Broj sastanaka po mjesecima" },
            monthlyCounts.map((count, index) =>
              e("div", { className: "bar-column", key: monthLabels[index] + index },
                e("span", { className: "bar-number" }, count),
                e("div", { className: "bar-track" },
                  e("span", { style: { height: Math.max(count ? 12 : 3, (count / maxMonthlyCount) * 100) + "%" } })
                ),
                e("small", null, monthLabels[index])
              )
            )
          )
        )
      ),
      e("section", { className: "dashboard-panel next-meetings" },
        e("div", { className: "dashboard-panel-heading" },
          e("div", null,
            e("h2", null, "Sljedeći sastanci"),
            e("p", null, "Najbliži termini u rasporedu")
          )
        ),
        plannedMeetingsList.length === 0
          ? e("div", { className: "dashboard-empty" }, "Još nema planiranih sastanaka.")
          : e("div", { className: "dashboard-meeting-list" },
              plannedMeetingsList.slice(0, 3).map((meeting) =>
                e("div", { key: meeting.id },
                  e("span", null, new Date(meeting.meeting_date + "T00:00:00").toLocaleDateString("hr-HR", { day: "2-digit", month: "short" })),
                  e("strong", null, meeting.company_name),
                  e("small", null, String(meeting.meeting_time).slice(0, 5) + " · " + meeting.contact_name)
                )
              )
            )
      ),
      e("section", { className: "dashboard-panel next-meetings" },
        e("div", { className: "dashboard-panel-heading" },
          e("div", null,
            e("h2", null, "Završeni sastanci"),
            e("p", null, "Ishodi posljednjih sastanaka")
          )
        ),
        completedMeetingsList.length === 0
          ? e("div", { className: "dashboard-empty" }, "Još nema završenih sastanaka.")
          : e("div", { className: "completed-meeting-list" },
              completedMeetingsList.slice(0, 5).map((meeting) => {
                const statusMeta = MEETING_STATUS[meeting.status];
                return e("div", { key: meeting.id },
                  e("span", { className: "completed-date" },
                    new Date(meeting.meeting_date + "T00:00:00").toLocaleDateString("hr-HR", { day: "2-digit", month: "short" })
                  ),
                  e("div", null,
                    e("strong", null, meeting.company_name),
                    e("small", null, meeting.outcome_notes || meeting.meeting_notes || "—")
                  ),
                  statusMeta && e("span", { className: "status-badge " + statusMeta.className }, statusMeta.label)
                );
              })
            )
      )
    );
  }

  function PortalApp() {
    const [clients, setClients] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const [loadError, setLoadError] = React.useState("");
    const [query, setQuery] = React.useState("");
    const [formOpen, setFormOpen] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState("dashboard");
    const [meetings, setMeetings] = React.useState([]);
    const [meetingModal, setMeetingModal] = React.useState(null);

    const normalizedQuery = query.trim().toLowerCase();
    const visibleClients = clients.filter((client) =>
      [client.company_name, client.oib, client.contact_name, client.email, client.phone]
        .some((value) => String(value || "").toLowerCase().includes(normalizedQuery))
    );

    React.useEffect(() => {
      Promise.all([api("session.php"), api("clients.php"), api("clients.php?resource=meetings")])
        .then(([sessionData, clientsData, meetingsData]) => {
          setUser(sessionData.user);
          setClients(clientsData.clients || []);
          setMeetings(meetingsData.meetings || []);
        })
        .catch((error) => setLoadError(error.message));
    }, []);

    async function addClient(client) {
      const data = await api("clients.php", {
        method: "POST",
        body: JSON.stringify(client)
      });
      setClients((current) => [data.client, ...current]);
      setFormOpen(false);
    }

    function openMeetingForm(meeting) {
      setMeetingModal(meeting || true);
    }

    async function saveMeeting(form) {
      const payload = {
        resource: "meeting",
        clientId: Number(form.clientId),
        date: form.date,
        time: form.time,
        duration: form.duration,
        reminderEnabled: form.reminderEnabled,
        reminderOffset: form.reminderOffset,
        clientReminderEnabled: form.clientReminderEnabled,
        clientReminderOffset: form.clientReminderOffset,
        notes: form.notes
      };
      if (form.id) {
        payload.id = form.id;
      }
      const data = await api("clients.php", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setMeetings((current) => {
        const withoutMeeting = current.filter((meeting) => meeting.id !== data.meeting.id);
        return [...withoutMeeting, data.meeting].sort((first, second) =>
          (first.meeting_date + first.meeting_time).localeCompare(second.meeting_date + second.meeting_time)
        );
      });
      setMeetingModal(null);
    }

    async function updateMeetingStatus(id, status, notes) {
      const data = await api("clients.php", {
        method: "POST",
        body: JSON.stringify({ resource: "meeting-status", id, status, notes })
      });
      setMeetings((current) => current.map((meeting) => (meeting.id === data.meeting.id ? data.meeting : meeting)));
    }

    async function logout() {
      await api("logout.php", { method: "POST", body: "{}" }).catch(() => {});
      window.location.replace("login.html");
    }

    return e("div", { className: "portal-shell" },
      e(Sidebar, { onLogout: logout, user, activeSection, onNavigate: setActiveSection }),
      e("main", { className: "portal-main" },
        activeSection === "dashboard"
          ? e(DashboardSection, { clients, meetings })
          : activeSection === "planning"
          ? e(PlanningSection, {
              clients,
              meetings,
              formOpen: Boolean(meetingModal),
              editingMeeting: meetingModal && meetingModal !== true ? meetingModal : null,
              onOpenForm: openMeetingForm,
              onCloseForm: () => setMeetingModal(null),
              onSaveMeeting: saveMeeting,
              onCompleteMeeting: updateMeetingStatus
            })
          : e(React.Fragment, null,
        e("header", { className: "portal-header" },
          e("div", null,
            e("span", { className: "eyebrow" }, "Poslovni portal"),
            e("h1", null, "Klijenti"),
            e("p", null, "Pregled i upravljanje podacima vaših klijenata.")
          ),
          e("button", { type: "button", className: "portal-primary add-client", onClick: () => setFormOpen(true) },
            e("span", { "aria-hidden": "true" }, "+"),
            "Dodaj klijenta"
          )
        ),
        e("section", { className: "client-stats", "aria-label": "Sažetak klijenata" },
          e("article", null,
            e("span", { className: "stat-icon" }, "◫"),
            e("div", null, e("small", null, "Ukupno klijenata"), e("strong", null, clients.length))
          ),
          e("article", null,
            e("span", { className: "stat-icon pale" }, "@"),
            e("div", null, e("small", null, "S email adresom"), e("strong", null, clients.filter((client) => client.email).length))
          )
        ),
        e("section", { className: "clients-panel" },
          e("div", { className: "clients-toolbar" },
            e("div", null,
              e("h2", null, "Popis klijenata"),
              e("p", null, visibleClients.length + (visibleClients.length === 1 ? " klijent" : " klijenata"))
            ),
            e("label", { className: "search-field" },
              e("span", { "aria-hidden": "true" }, "⌕"),
              e("input", { type: "search", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Pretraži klijente...", "aria-label": "Pretraži klijente" })
            )
          ),
          loadError
            ? e("div", { className: "clients-empty" }, e("h3", null, "Nije moguće učitati klijente"), e("p", null, loadError))
            : e(ClientsTable, { clients: visibleClients })
        ))
      ),
      formOpen && e(ClientForm, { onClose: () => setFormOpen(false), onSave: addClient })
    );
  }

  ReactDOM.createRoot(document.getElementById("portal-root")).render(e(PortalApp));
})();
