using PETCENTER.MANTENIMIENTO.LOCALES.Comun;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO
{
    public class RegistrarFichaMantenimientoResponseDTO
    {
        public RegistrarFichaMantenimientoResponseDTO()
        {
            this.Result = new Result();
        }
        public Result Result { get; set; }
    }
}