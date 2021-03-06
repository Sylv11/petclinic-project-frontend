import React, { Component } from 'react'
import '../../assets/css/index.css'
import '../../assets/css/form.css'
import '../../assets/css/pet.css'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import Loader from '../common/Loader'
import Check from '../../Check'

class AddPet extends Component {

    state = {
        owner: null,
        loading: false
    }

    getOwner = async () => {
        const { ownerId } = this.props.match.params
        this.setState({ loading: true })
        const result = await axios.get(`http://localhost:8080/getOwner/${ownerId}`)
        return await result
    }

    setOwner = () => {
        this.getOwner()
            .then((result) => {
                this.setState({ owner: result.data, loading: false })
            })
            .catch((err) => this.props.history.push('/error'))
    }

    addPet = async () => {
        const pet = {
            ownerId: parseInt(this.props.match.params.ownerId),
            name: this.inputName.value,
            dateBirth: this.inputBirthDate.value,
            type: this.inputType.value
        }

        try {
            if (Check.isString(pet.name, 3)) {
                if (Check.isDate(pet.dateBirth)) {
                    if (Check.checkType(pet.type)) {
                        await axios.post(`http://localhost:8080/addPet`, pet)
                        this.props.history.push({
                            pathname: `/ownerInformations/${this.state.owner.lastname}`,
                            state: {
                                petAdded: true,
                                petType: pet.type
                            }
                        })
                    } else {
                        Check.errorMessage('Invalid type!')
                    }
                } else {
                    Check.errorMessage('Invalid date format!')
                }
            } else {
                Check.errorMessage('name is not a string or to short!')
            }
        } catch (e) {
            this.props.history.push('/error')
        }
    }

    componentWillMount = () => {
        this.setOwner()
    }


    render() {

        const style = {
            width: '55%',
            marginLeft: '0px'
        }

        return (
            <div className='home-subcontainer'>
                {!this.state.loading ?
                    <div>
                        <h3>Pet</h3>
                        <form method='put' onSubmit={(e) => { e.preventDefault(); }}>
                            <div className='form-group pet-form'>
                                <label>Owner</label>
                                {this.state.owner &&
                                    <input className='form-control' size="30" maxLength="80" name="owner" defaultValue={`${this.state.owner.lastname} ${this.state.owner.firstname}`} disabled />
                                }
                            </div>
                            <div className='form-group'>
                                <label>Name</label>
                                <input className='form-control' size="30" maxLength="80" placeholder="Name" name="firstname" defaultValue="" ref={inputName => this.inputName = inputName} />
                            </div>
                            <div className='form-group'>
                                <label>Birth date</label>
                                <input className='form-control' size="30" maxLength="80" placeholder="Birth date" name="lastName" defaultValue="" ref={inputBirthDate => this.inputBirthDate = inputBirthDate} />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select ref={inputType => this.inputType = inputType}>
                                    <option>bird</option>
                                    <option>cat</option>
                                    <option>dog</option>
                                    <option>hamster</option>
                                    <option>lizard</option>
                                    <option>snake</option>
                                </select>
                            </div>
                            <div className='form-group' style={{ textAlign: 'center' }}>
                                <button className='btn-default' style={style} type='button' value='text' name='addPet' onClick={this.addPet}>Add Pet</button>
                            </div>
                        </form>
                    </div>
                    : (<Loader height={124} width={124} />)}
            </div>
        )
    }
}

export default withRouter(AddPet)