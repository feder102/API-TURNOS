const uuid = require('uuid/v1')

class Mascota {
    constructor(nombre, tipo, fechaNacimiento, esDeRaza, raza) {
        this._id = uuid()
        this.nombre = nombre
        this.tipo = tipo
        this.fechaNacimiento = fechaNacimiento
        this.esDeRaza = esDeRaza
        this.raza = raza
    }
}

module.exports = Mascota