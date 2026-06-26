import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

function Header(){

    const { admin, logout } = useContext(AdminContext);


    return (
        <header>

            <h2>
                Sistema Administrativo
            </h2>


            {
                admin && (
                    <div>

                        <p>
                            Usuario:
                            {admin.nombre}
                        </p>

                        <p>
                            Sector:
                            {admin.sector}
                        </p>


                        <button onClick={logout}>
                            Cerrar Sesión
                        </button>


                    </div>
                )
            }


        </header>
    )
}


export default Header;