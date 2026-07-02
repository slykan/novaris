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
    return e("a", { className: "portal-brand compact", href: "index.html", "aria-label": "Novaris Tech početna" },
      e("img", { src: "logo3_small.png", alt: "", width: 50, height: 50 }),
      e("span", null,
        e("strong", null, "NOVARIS"),
        e("small", null, "TECH")
      )
    );
  }

  function Sidebar({ onLogout, user }) {
    return e("aside", { className: "portal-sidebar" },
      e(Brand),
      e("nav", { className: "portal-nav", "aria-label": "Glavna navigacija" },
        e("a", { className: "active", href: "portal.html" },
          e("span", { "aria-hidden": "true" }, "◫"),
          "Klijenti"
        )
      ),
      e("div", { className: "sidebar-bottom" },
        e("div", { className: "signed-in-user" },
          e("span", { className: "avatar" }, "A"),
          e("span", null,
            e("strong", null, user ? user.name : "Administrator"),
            e("small", null, user ? user.email : "")
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

  function PortalApp() {
    const [clients, setClients] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const [loadError, setLoadError] = React.useState("");
    const [query, setQuery] = React.useState("");
    const [formOpen, setFormOpen] = React.useState(false);

    const normalizedQuery = query.trim().toLowerCase();
    const visibleClients = clients.filter((client) =>
      [client.company_name, client.oib, client.contact_name, client.email, client.phone]
        .some((value) => String(value || "").toLowerCase().includes(normalizedQuery))
    );

    React.useEffect(() => {
      Promise.all([api("session.php"), api("clients.php")])
        .then(([sessionData, clientsData]) => {
          setUser(sessionData.user);
          setClients(clientsData.clients || []);
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

    async function logout() {
      await api("logout.php", { method: "POST", body: "{}" }).catch(() => {});
      window.location.replace("login.html");
    }

    return e("div", { className: "portal-shell" },
      e(Sidebar, { onLogout: logout, user }),
      e("main", { className: "portal-main" },
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
        )
      ),
      formOpen && e(ClientForm, { onClose: () => setFormOpen(false), onSave: addClient })
    );
  }

  ReactDOM.createRoot(document.getElementById("portal-root")).render(e(PortalApp));
})();
