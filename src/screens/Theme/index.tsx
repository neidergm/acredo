// Visual styleguide. Refleja el estado actual de `src/styles/_variables.scss` y
// los theme colors custom. Todos los valores se leen en runtime desde las
// CSS variables de Bootstrap (`--bs-*`) — cero hex hardcoded en este archivo.
//
// Para agregar/quitar theme colors: editar `_theme-colors.scss`. La lista
// THEME_COLORS abajo es la única dependencia manual y debe coincidir con
// el map `$theme-colors` final del Sass.

import { useSyncExternalStore } from 'react';
import { Alert, Badge, Button, Card, CardBody, CardHeader, FormGroup, Input, Label, Progress } from 'reactstrap';

const THEME_COLORS = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark',
    'primary-surface',
] as const;

const RADIUS_TOKENS = [
    { name: 'sm',    cssVar: '--bs-border-radius-sm' },
    { name: 'base',  cssVar: '--bs-border-radius' },
    { name: 'lg',    cssVar: '--bs-border-radius-lg' },
    { name: 'xl',    cssVar: '--bs-border-radius-xl' },
    { name: 'xxl',   cssVar: '--bs-border-radius-xxl' },
    { name: 'pill',  cssVar: '--bs-border-radius-pill' },
];

const SHADOW_TOKENS = [
    { name: 'sm',   cssVar: '--bs-box-shadow-sm' },
    { name: 'base', cssVar: '--bs-box-shadow' },
    { name: 'lg',   cssVar: '--bs-box-shadow-lg' },
];

// Lee una CSS variable desde :root en runtime.
// useSyncExternalStore evita el patrón setState-in-effect.
const noopSubscribe = () => () => {};
const useCssVar = (name: string) => {
    return useSyncExternalStore(
        noopSubscribe,
        () => (typeof document !== 'undefined'
            ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
            : ''),
        () => '',
    );
};

const ColorSwatch = ({ name }: { name: string }) => {
    const hex = useCssVar(`--bs-${name}`);
    return (
        <div className="d-flex flex-column gap-1">
            <div className={`bg-${name} rounded border`} style={{ height: 56 }} />
            <code className="small fw-semibold">{name}</code>
            <code className="small text-secondary">{hex || `var(--bs-${name})`}</code>
        </div>
    );
};

const TokenValue = ({ cssVar }: { cssVar: string }) => {
    const v = useCssVar(cssVar);
    return <code className="small text-secondary">{v || cssVar}</code>;
};

const Theme = () => {
    return (
        <div className="container-xxxl py-5 px-3 px-md-4 px-lg-5">

            <header className="mb-5 pb-4 border-bottom">
                <span className="eyebrow d-block mb-2">Sistema de diseño</span>
                <h1 className="mb-2">Acredo · Theming</h1>
                <p className="text-secondary mb-0" style={{ maxWidth: 760 }}>
                    Refleja el estado actual de <code>_variables.scss</code> y los theme colors custom.
                    Los valores se leen en runtime desde las CSS variables <code>--bs-*</code>.
                </p>
            </header>

            {/* ===== 1 · Theme colors ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">1 · Theme colors</h2>
                <p className="text-secondary small mb-3">
                    10 slots semánticos. Cada uno auto-genera el set completo de utilities
                    (bg, text, border, btn, alert, badge).
                </p>
                <div className="row g-3">
                    {THEME_COLORS.map(c => (
                        <div key={c} className="col-6 col-md-4 col-lg-3 col-xl-2">
                            <ColorSwatch name={c} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== 2 · Variantes por color ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">2 · Variantes por color</h2>
                <p className="text-secondary small mb-3">
                    Solid, subtle, text-emphasis, border-subtle, btn solid/outline.
                </p>
                <div className="row g-3">
                    {THEME_COLORS.map(c => (
                        <div key={c} className="col-12 col-md-6 col-xl-4">
                            <Card>
                                <CardBody>
                                    <code className="d-block fw-semibold mb-3">{c}</code>

                                    <div className="d-flex gap-1 mb-3" style={{ height: 32 }}>
                                        <div className={`flex-fill bg-${c}`} title={`.bg-${c}`} />
                                        <div className={`flex-fill bg-${c}-subtle border border-${c}-subtle`} title={`.bg-${c}-subtle`} />
                                    </div>

                                    <div className="d-flex flex-wrap gap-3 small mb-3">
                                        <span className={`text-${c}`}>.text-{c}</span>
                                        <span className={`text-${c}-emphasis fw-semibold`}>.text-{c}-emphasis</span>
                                    </div>

                                    <div className="d-flex gap-2 flex-wrap">
                                        <Button color={c} size="sm">btn-{c}</Button>
                                        <Button outline color={c} size="sm">outline</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== 3 · Botones ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">3 · Botones</h2>
                <Card>
                    <CardBody>
                        <div className="small text-secondary mb-2">Solid (<code>.btn-{`{name}`}</code>)</div>
                        <div className="d-flex gap-2 flex-wrap mb-4">
                            {THEME_COLORS.map(c => <Button key={c} color={c}>{c}</Button>)}
                        </div>

                        <div className="small text-secondary mb-2">Outline (<code>.btn-outline-{`{name}`}</code>)</div>
                        <div className="d-flex gap-2 flex-wrap mb-4">
                            {THEME_COLORS.map(c => <Button key={c} outline color={c}>{c}</Button>)}
                        </div>

                        <div className="small text-secondary mb-2">Tamaños y estados</div>
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                            <Button color="primary" size="sm">Small</Button>
                            <Button color="primary">Default</Button>
                            <Button color="primary" size="lg">Large</Button>
                            <Button color="primary" disabled>Disabled</Button>
                            <Button color="primary" active>Active</Button>
                        </div>
                    </CardBody>
                </Card>
            </section>

            {/* ===== 4 · Alerts ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">4 · Alerts</h2>
                <p className="text-secondary small mb-3">
                    Usan <code>--bs-{`{name}`}-bg-subtle</code>, <code>--bs-{`{name}`}-border-subtle</code> y{' '}
                    <code>--bs-{`{name}`}-text-emphasis</code>.
                </p>
                <div className="vstack gap-2">
                    {THEME_COLORS.map(c => (
                        <Alert key={c} color={c} className="mb-0">
                            <code className="me-2 fw-semibold">.alert-{c}</code>
                            Alert con variante <strong>{c}</strong>.
                        </Alert>
                    ))}
                </div>
            </section>

            {/* ===== 5 · Tipografía ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">5 · Tipografía</h2>
                <p className="text-secondary small mb-3">
                    Base: <code>DM Sans Variable</code>. Headings <code>$_navy</code>, body{' '}
                    <code>#1E3A5F</code>, muted <code>$_muted</code>.
                </p>
                <Card>
                    <CardBody>
                        <h1>Heading h1</h1>
                        <h2>Heading h2</h2>
                        <h3>Heading h3</h3>
                        <h4>Heading h4</h4>
                        <h5>Heading h5</h5>
                        <h6>Heading h6</h6>
                        <hr />
                        <p>Body por defecto sobre fondo blanco.</p>
                        <p className="lead">Lead (<code>.lead</code>) — más grande, peso ligero.</p>
                        <p className="text-secondary"><code>.text-secondary</code> — labels, meta, copy de soporte.</p>
                        <p className="text-muted"><code>.text-muted</code> — mismo rol que secondary.</p>
                        <p><span className="eyebrow">Eyebrow custom</span> — clase utilitaria para sobre-títulos.</p>
                        <p>Link primario: <a href="#theming">link estilizado</a>.</p>
                        <p><code>inline code</code> · <small>texto small</small> · <strong>negrita</strong> · <em>cursiva</em></p>
                    </CardBody>
                </Card>
            </section>

            {/* ===== 6 · Formularios ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">6 · Formularios</h2>
                <Card>
                    <CardBody>
                        <div className="row g-3">
                            <FormGroup className="col-md-6">
                                <Label className="form-label">Campo estándar</Label>
                                <Input placeholder="Texto..." />
                                <div className="form-text">Helper con <code>.form-text</code>.</div>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label className="form-label">Select</Label>
                                <Input type="select">
                                    <option>Opción 1</option>
                                    <option>Opción 2</option>
                                </Input>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label className="form-label">Válido</Label>
                                <Input className="is-valid" defaultValue="Valor aceptado" />
                                <div className="valid-feedback">Bien.</div>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label className="form-label">Inválido</Label>
                                <Input className="is-invalid" defaultValue="Error" />
                                <div className="invalid-feedback">Mensaje de error.</div>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label className="form-label">Deshabilitado</Label>
                                <Input disabled defaultValue="No editable" />
                            </FormGroup>
                            <FormGroup className="col-md-6 d-flex align-items-end gap-3">
                                <FormGroup check>
                                    <Input type="checkbox" defaultChecked id="t-cb" />
                                    <Label check for="t-cb">Checkbox</Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Input type="radio" name="t-r" defaultChecked id="t-r1" />
                                    <Label check for="t-r1">Radio</Label>
                                </FormGroup>
                            </FormGroup>
                        </div>
                    </CardBody>
                </Card>
            </section>

            {/* ===== 7 · Badges y progress ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">7 · Badges y progress</h2>
                <div className="row g-3">
                    <div className="col-md-6">
                        <Card body>
                            <div className="small text-secondary mb-2">Badges (<code>.badge bg-{`{name}`}</code>)</div>
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {THEME_COLORS.map(c => <Badge key={c} color={c}>{c}</Badge>)}
                            </div>
                            <div className="small text-secondary mb-2">Pill</div>
                            <div className="d-flex flex-wrap gap-2">
                                {THEME_COLORS.map(c => <Badge key={c} color={c} pill>{c}</Badge>)}
                            </div>
                        </Card>
                    </div>
                    <div className="col-md-6">
                        <Card body>
                            <div className="small text-secondary mb-2">Progress (<code>.progress</code>)</div>
                            <Progress value={25} className="mb-2" />
                            <Progress value={50} className="mb-2" />
                            <Progress value={75} className="mb-2" />
                            <Progress value={100} />
                        </Card>
                    </div>
                </div>
            </section>

            {/* ===== 8 · Cards ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">8 · Cards</h2>
                <div className="row g-3">
                    <div className="col-md-4">
                        <Card>
                            <CardBody>
                                <p className="mb-2">Card simple.</p>
                                <Button color="primary" size="sm">Acción</Button>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card>
                            <CardHeader>Con header</CardHeader>
                            <CardBody>
                                <p className="mb-0">Hereda <code>border-radius</code> del wrapper.</p>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card body className="bg-primary-subtle border-primary-subtle">
                            <p className="text-primary-emphasis mb-0">Subtle + emphasis para destacar.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* ===== 9 · Border radius ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">9 · Border radius</h2>
                <div className="d-flex flex-wrap gap-4">
                    {RADIUS_TOKENS.map(r => (
                        <div key={r.name} className="d-flex flex-column align-items-center gap-1">
                            <div className="bg-primary" style={{ width: 64, height: 64, borderRadius: `var(${r.cssVar})` }} />
                            <code className="small fw-semibold">{r.name}</code>
                            <TokenValue cssVar={r.cssVar} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== 10 · Shadows ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">10 · Shadows</h2>
                <div className="row g-3">
                    {SHADOW_TOKENS.map(s => (
                        <div key={s.name} className="col-md-4">
                            <div className="bg-white p-4 rounded text-center" style={{ boxShadow: `var(${s.cssVar})` }}>
                                <code className="small fw-semibold">{s.name}</code>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== 11 · Breakpoints ===== */}
            <section className="mb-5">
                <h2 className="h4 mb-1">11 · Breakpoints</h2>
                <p className="text-secondary small mb-3">
                    Sufijos disponibles para utilities responsive (<code>.col-{`{N}`}-N</code>, <code>.d-{`{N}`}-flex</code>,
                    <code>.p-{`{N}`}-N</code>, etc.). Valores definidos en <code>$grid-breakpoints</code> de{' '}
                    <code>_variables.scss</code>.
                </p>
                <Card body>
                    <table className="table table-sm mb-0 small font-monospace">
                        <thead>
                            <tr>
                                <th>Sufijo</th>
                                <th>min-width</th>
                                <th>Container max-width</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><code>xs</code></td><td>0</td><td>—</td></tr>
                            <tr><td><code>sm</code></td><td>576px</td><td>540px</td></tr>
                            <tr><td><code>md</code></td><td>768px</td><td>720px</td></tr>
                            <tr><td><code>lg</code></td><td>992px</td><td>960px</td></tr>
                            <tr><td><code>xl</code></td><td>1200px</td><td>1140px</td></tr>
                            <tr><td><code>xxl</code></td><td>1400px</td><td>1320px</td></tr>
                            <tr><td><code>xxxl</code></td><td>1600px</td><td>1540px</td></tr>
                        </tbody>
                    </table>
                </Card>
            </section>

        </div>
    );
};

export default Theme;
