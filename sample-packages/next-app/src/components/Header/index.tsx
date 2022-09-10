import React from "react"
import Styles from "./Header.module.scss"
import Link from 'next/link'

function Header() {
    return (
        <div>
            <div className={Styles["header-top-bar"]}>
                <div className={Styles["header-content"]}>Track your Order</div>
                <Link href="/login" passHref>
                    <a>
                        <div className={Styles["header-content"]}>Login | SignUp</div>
                    </a>
                </Link>
            </div>
            <div>
                <img className={Styles["header-logo"]} src="/images/logo.png" />
            </div>
        </div>
    )
}

export default Header
export { Header }
