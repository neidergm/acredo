const _CONFIG = {
    storage_prefix: "masteru",
    api_base_url: 'https://axis.curn.edu.co/apimaster/api',
    error_reporting_url: "https://axis.curn.edu.co/apildap/api/log/errorwrite",
    google_client: {
        active: true,
        method_name: "google",
        id: '227610805652-c451askq3usbv82f8e7v6g3qd6i1vdpq.apps.googleusercontent.com',
        show_one_tap: true,
    },
    maintenance_url: "https://axis.curn.edu.co/apiaxis/api/mantenimiento/masteru", //OPTIONAL TO VERIFY IF APP IS IN MAINTENANCE
}

window._NGconfig = _CONFIG;
