const _CONFIG = {
    storage_prefix: "masteru",
    api_base_url: 'https://axis.curn.edu.co/apisiac/api',
    error_reporting_url: "https://axis.curn.edu.co/apildap/api/log/errorwrite",
    google_client: {
        active: true,
        method_name: "google",
        id: '227610805652-c451askq3usbv82f8e7v6g3qd6i1vdpq.apps.googleusercontent.com',
        show_one_tap: true,
    },
    microsoft_client: {
        active: false,
        method_name: "365",
        id: '78e46a35-44a1-412b-bdc7-e6587cc94f5f',
        tenant_id: 'cd512378-af46-4ef6-ab89-c6f7482951f4',
        redirect_uri: 'http://localhost:3000',
    },
    email_client: {
        active: false,
        method_name: "email",
        code_length: 6
    },
    recatpcha_client: {
        active: true,
        id: "6LeB0W4UAAAAACXqVNcH-HWzYjcgCw2sY7iMtu0R"
    },
    // app_url: 'https://activa.curn.edu.co', //App public link
    maintenance_url: "https://axis.curn.edu.co/apiaxis/api/mantenimiento/masteru", //OPTIONAL TO VERIFY IF APP IS IN MAINTENANCE
}

window._NGconfig = _CONFIG;
