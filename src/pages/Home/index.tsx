import React from 'react'
import { FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import './styles.css'

import logo from '../../assets/logo.png'

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt=""/>
                </header>
                <main>
                    <h1>Seu markplace de Grupos de Oração.</h1>
                    <p>Ajudando pessoas a encontrarem um Grupo pertinho de casa.</p>
                    <Link to="/create-group">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um Grupo de Oração</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home