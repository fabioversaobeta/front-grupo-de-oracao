import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import ConfirmPage from '../../components/ConfirmPage'

import './styles.css'

import logo from '../../assets/logo.png'

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const CreateGroup = () => {
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        facebook: '',
        instagram: '',
        youtube: '',
        parish: '',
        community: '',
        district: '',
        day: '',
        hour: ''
    })

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('')
    const [selectedDay, setSelectedDay] = useState('')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    const [blConfirm, setBlConfirm] = useState<boolean>(false)

    const history = useHistory()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            setInitialPosition([latitude, longitude])
        })
    }, [])
    
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)

            ufInitials.sort()

            setUfs(ufInitials)
        })
        
    }, [])

    useEffect(() => {
        if (selectedUf === '0') {
            return
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome)

                setCities(cityNames)
        })
    }, [selectedUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value

        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value

        setSelectedCity(city)
    }

    function handleSelectDay(event: ChangeEvent<HTMLSelectElement>) {
        const day = event.target.value

        setSelectedDay(day)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target

        setFormData({ ...formData, [name]: value})
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const { name, email, whatsapp, facebook, instagram, youtube, parish, community, district, hour } = formData
        const uf = selectedUf
        const city = selectedCity
        const day = selectedDay
        const [latitude, longitude] = selectedPosition

        const data = new FormData()

        data.append('name', name)
        data.append('parish', parish)
        data.append('community', community)
        data.append('day', String(day))
        data.append('hour', hour)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('facebook', facebook)
        data.append('instagram', instagram)
        data.append('youtube', youtube)
        data.append('uf', uf)
        data.append('city', city)
        data.append('district', district)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))

        const json = {
            name, parish, community, day, hour, email, whatsapp, facebook,
            instagram, youtube, uf, city, district, latitude, longitude
        }
      
        await api.post('groups', json)

        setBlConfirm(true)

        setTimeout(function() {
            history.push('/')
        }, 2000)
    }

    return (
        <div id="page-create-group">
            <header>
                <img src={logo} alt="Renovação Carismática Católica" height="100"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            
            <form autoComplete="off" onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> grupo de oração</h1>

                <fieldset>
                    <legend>
                        <h2>Dados do grupo</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome do grupo de oração</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            onChange={handleInputChange}/>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="parish">Paróquia</label>
                            <input 
                                type="text"
                                name="parish"
                                id="parish"
                                onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="community">Comunidade</label>
                            <input 
                                type="text"
                                name="community"
                                id="community"
                                onChange={handleInputChange}/>
                        </div>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="day">Dia do grupo</label>
                            <select 
                                name="day"
                                id="day"
                                value={selectedDay}
                                onChange={handleSelectDay}
                            >
                                <option value="" selected>Selecione um dia da semana</option>
                                <option value="Domingo">Domingo</option>
                                <option value="Segunda">Segunda</option>
                                <option value="Terça">Terça</option>
                                <option value="Quarta">Quarta</option>
                                <option value="Quinta">Quinta</option>
                                <option value="Sexta">Sexta</option>
                                <option value="Sábado">Sábado</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="hour">Horário do grupo</label>
                            <input 
                                type="text"
                                name="hour"
                                id="hour"
                                onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Redes sociais do grupo</h2>
                    </legend>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="facebook">Facebook</label>
                            <input 
                                type="text"
                                name="facebook"
                                id="facebook"
                                onChange={handleInputChange}/>
                        </div>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="instagram">Instagram</label>
                            <input 
                                type="text"
                                name="instagram"
                                id="instagram"
                                onChange={handleInputChange}/>
                        </div>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="youtube">YouTube</label>
                            <input 
                                type="text"
                                name="youtube"
                                id="youtube"
                                onChange={handleInputChange}/>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço onde o grupo acontece</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="district">Bairro</label>
                            <input 
                                type="text"
                                name="district"
                                id="district"
                                onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Seus dados</h2>
                    </legend>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="email">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>

            { blConfirm ? <ConfirmPage /> : null }
            
        </div>
        
    )
}

export default CreateGroup