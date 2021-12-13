const { Categoria,Role,Usuario,Producto } = require("../models");


const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });

  if (!existeRol) {
    throw new Error(`El rol: ${rol}, no está registrado en la base de datos`);
  }
};

const correoExiste = async (correo = '') => {
  const existeCorreo = await Usuario.findOne({ correo });
  if (existeCorreo) {
    throw new Error(
      `El correo: ${correo}, ya está registrado en la base de datos`
    );
  }
};

const usuarioPorIdExiste = async (id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
      throw new Error(
        `El usuario: ${id}, no está registrado en la base de datos`
      );
    }
  };

  const existeCategoria = async (id = '') =>{
    const existeCat = await Categoria.findById(id);
    if (!existeCat) {
      throw new Error(
        `la Categoría: ${id}, no está registrada en la base de datos`
      );
    }

  }

  const existeProducto = async (id = '') =>{
    const existeProd = await Producto.findById(id);
    if (!existeProd) {
      throw new Error(
        `El producto: ${id}, no está registrada en la base de datos`
      );
    }

  }

module.exports = {
  esRoleValido,
  correoExiste,
  usuarioPorIdExiste,
  existeCategoria,
  existeProducto
};
