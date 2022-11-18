import './header.css'
export const Header = ({ titulo = "CONDICIONES DE CALIDAD" }: { titulo?: string }) => {

    return (
        <div className="header p-4  condiciones-header">
        <div className="title  fs-3 text-white">
          <div className="container">{titulo}</div>
        </div>
      </div>
    )
}
export default Header;