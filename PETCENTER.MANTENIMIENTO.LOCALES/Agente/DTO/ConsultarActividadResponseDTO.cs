using PETCENTER.MANTENIMIENTO.LOCALES.Comun;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO
{
    public class ConsultarActividadResponseDTO 
    {
        public ConsultarActividadResponseDTO()
        {
            this.Result = new Result();
            this.ActividadList = new List<ActividadDTO>();
        }
        public Result Result { get; set; }
        public List<ActividadDTO> ActividadList { get; set; }

    }
}