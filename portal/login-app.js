(function () {
  const e = React.createElement;
  const DEMO_EMAIL = "admin@novaris.hr";
  const DEMO_PASSWORD = "novaris2026";

  function Brand() {
    return e("a", { className: "portal-brand", href: "index.html", "aria-label": "Novaris Tech početna" },
      e("img", { src: "logo3_small.png", alt: "", width: 66, height: 66 }),
      e("span", null,
        e("strong", null, "NOVARIS"),
        e("small", null, "TECH")
      )
    );
  }

  function LoginApp() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState("");

    async function submit(event) {
      event.preventDefault();
      setError("");
      try {
        const response = await fetch("api/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Prijava nije uspjela.");
          return;
        }
        window.location.assign("portal.html");
      } catch (error) {
        setError("Portal trenutačno nije dostupan. Pokušajte ponovno.");
      }
    }

    return e("main", { className: "login-page" },
      e("section", { className: "login-intro" },
        e(Brand),
        e("div", { className: "login-copy" },
          e("span", { className: "eyebrow" }, "Novaris poslovni portal"),
          e("h1", null, "Sve važne informacije o klijentima na jednom mjestu."),
          e("p", null, "Jednostavan pregled kontakata, bilješki i podataka tvrtke za brži svakodnevni rad.")
        ),
        e("p", { className: "login-footer" }, "© 2026 Novaris Tech")
      ),
      e("section", { className: "login-panel" },
        e("div", { className: "login-card" },
          e("div", { className: "login-card-heading" },
            e("span", { className: "portal-icon", "aria-hidden": "true" }, "N"),
            e("h2", null, "Dobro došli"),
            e("p", null, "Prijavite se za nastavak u portal.")
          ),
          e("form", { onSubmit: submit, className: "portal-form" },
            e("label", { htmlFor: "email" }, "Email adresa"),
            e("input", {
              id: "email",
              type: "email",
              autoComplete: "username",
              value: email,
              onChange: (event) => setEmail(event.target.value),
              placeholder: "ime@novaris.hr",
              required: true
            }),
            e("label", { htmlFor: "password" }, "Lozinka"),
            e("div", { className: "password-field" },
              e("input", {
                id: "password",
                type: showPassword ? "text" : "password",
                autoComplete: "current-password",
                value: password,
                onChange: (event) => setPassword(event.target.value),
                placeholder: "Unesite lozinku",
                required: true
              }),
              e("button", {
                type: "button",
                className: "password-toggle",
                onClick: () => setShowPassword((value) => !value),
                "aria-label": showPassword ? "Sakrij lozinku" : "Prikaži lozinku"
              }, showPassword ? "Sakrij" : "Prikaži")
            ),
            error && e("p", { className: "form-error", role: "alert" }, error),
            e("button", { type: "submit", className: "portal-primary" }, "Prijavi se")
          ),
          e("div", { className: "demo-access" },
            e("strong", null, "Demo pristup"),
            e("span", null, DEMO_EMAIL),
            e("span", null, DEMO_PASSWORD)
          )
        )
      )
    );
  }

  ReactDOM.createRoot(document.getElementById("login-root")).render(e(LoginApp));
})();
