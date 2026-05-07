const _CONFIG = {
    app_title: "Acredo",
    app_help_link: "https://sites.google.com/curn.edu.co/acredohelp",
    app_colors: {
        login: {
            background: "#0f2030",
            color: "#fff"
        },
        header: {
            background: "#0f2030",
            color: "#f8f9fa"
        }
    },
    formation_type: ["TÉCNICO", "TECNOLOGO", "PROFESIONAL", "ESPECIALIZACIÓN"],
    storage_prefix: "acredo",
    api_base_url: 'https://axis.uninunez.edu.co/apimasterdemo/api',
    error_reporting_url: "https://axis.uninunez.edu.co/apildap/api/log/errorwrite",
    google_client: {
        active: true,
        method_name: "google",
        id: '227610805652-c451askq3usbv82f8e7v6g3qd6i1vdpq.apps.googleusercontent.com',
        show_one_tap: true,
    },
    maintenance_url: null
}

window._NGconfig = _CONFIG;
