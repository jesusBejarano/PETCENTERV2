using PETCENTER.MANTENIMIENTO.LOCALES.Comun;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO
{
    public class ConsultarMantenimientoResponseDTO : ResponsePaginacionBaseDTO
    {
        public ConsultarMantenimientoResponseDTO()
        {
            this.Result = new Result();
            this.MantenimientoList = new List<MantenimientoDTO>();
        }        
        public List<MantenimientoDTO> MantenimientoList { get; set; }
    }
}