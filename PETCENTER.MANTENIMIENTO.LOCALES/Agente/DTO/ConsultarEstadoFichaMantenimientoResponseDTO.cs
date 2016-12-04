using PETCENTER.MANTENIMIENTO.LOCALES.Comun;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO
{
    public class ConsultarEstadoFichaMantenimientoResponseDTO
    {
        public ConsultarEstadoFichaMantenimientoResponseDTO()
        {
            this.Result = new Result();
            this.EstadoFichaMatenimientoList = new List<EstadoFichaMantenimientoDTO>();
        }
        public Result Result { get; set; }
        public List<EstadoFichaMantenimientoDTO> EstadoFichaMatenimientoList { get; set; }
    }
}