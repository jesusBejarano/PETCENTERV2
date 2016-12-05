using PETCENTER.MANTENIMIENTO.LOCALES.Comun;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO
{
    public class ConsultarMaterialResponseDTO
    {
       
            public ConsultarMaterialResponseDTO()
            {
                this.Result = new Result();
                this.MaterialList = new List<MaterialDTO >();
            }
            public Result Result { get; set; }
            public List<MaterialDTO> MaterialList { get; set; }

        
    }
}