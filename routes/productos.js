const { Router } = require("express");
const { check } = require("express-validator");

const {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto


} = require("../controllers/productos");

const {
  validarCampos,
  validateJWT,
  tieneRole,
  esADminRole,
} = require("../middlewares");

const {
  esRoleValido,
  existeProducto,
  existeCategoria
} = require("../helpers/db-validators");

const router = Router();
//Obtener todos los productos - publico
router.get("/", obtenerProductos);

// Obtener un producto por id - Publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);

//Crear producto - privado
router.post(
  "/",
  [
    validateJWT,
    check("nombre", "El nombre es requerido").not().isEmpty(),
    check("categoria", "La categoria es requerida").not().isEmpty(),
    check("categoria", "No es un mongo id").isMongoId(),
    check("categoria").custom(existeCategoria),
    //check('usuario','El usuario es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  crearProducto
);

//Actualizar un producto - privado
router.put(
  "/:id",
  [
    validateJWT,
    tieneRole("ADMIN", "EMPLOYEE"),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeProducto),
    check('categoria','No es un id de mongo valido').isMongoId(),
    check("rol").custom(esRoleValido),
  ],
  actualizarProducto
);

//Delete lógico - privado - Admin
router.delete("/:id", [
  validateJWT,
  esADminRole,
  check("id", "No es un id valido").isMongoId(),
  check("id").custom(existeProducto),
  validarCampos,
], 
borrarProducto
);

module.exports = router;
