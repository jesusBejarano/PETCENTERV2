using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PETCENTER.MANTENIMIENTO.LOCALES.Comun;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO
{
    public class ConsultarFichaResponseDTO : ResponsePaginacionBaseDTO
    {
        public ConsultarFichaResponseDTO()
        {
            this.Result = new Result();
            this.FichaMantenimientoList = new List<FichaDTO>();
        }

        public List<FichaDTO> FichaMantenimientoList { get; set; }
    }
}