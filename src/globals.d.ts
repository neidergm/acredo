declare module "*.css";
declare module "@fontsource/*" {}
declare module "@fontsource-variable/*" {}

// Forma del config inyectado en runtime por public/_config.js antes del bundle.
type T_NGConfig = {
  app_title: string;
  app_help_link: string;
  app_colors: {
    login: { background: string; color: string };
    header: { background: string; color: string };
  };
  formation_type: string[];
  storage_prefix: string;
  api_base_url: string;
  error_reporting_url: string;
  google_client: {
    active: boolean;
    method_name: string;
    id: string;
    show_one_tap: boolean;
  };
  maintenance_url?: string;
};

// Archivo de declaración global (sin import/export de nivel superior): este
// `interface Window` se fusiona con el Window de lib.dom sin `declare global`.
interface Window {
  _NGconfig: T_NGConfig;
}
