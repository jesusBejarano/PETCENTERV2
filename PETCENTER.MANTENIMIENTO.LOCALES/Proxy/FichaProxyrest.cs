﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO;
using PETCENTER.MANTENIMIENTO.LOCALES.Comun;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Proxy
{
    public class FichaProxyrest : ProxyBaseRest
    {
        public ConsultarFichaResponseDTO ConsultarFicha(ConsultarFichaRequestDTO request)
        {
            var url = ConfigurationManager.AppSettings["UrlConsultarFichaMantenimiento"];
            var response = DeserializarJSON<ConsultarFichaRequestDTO, ConsultarFichaResponseDTO>(request, url);
            if (response == null)
                throw new Exception(string.Format("Problemas con el servicio: {0}", url));

            return response;
        }
        public ConsultarMantenimientoResponseDTO ConsultarMantenimiento(ConsultarMantenimientoRequestDTO request)
        {
            var url = ConfigurationManager.AppSettings["UrlConsultarMantenimiento"];
            var response = DeserializarJSON<ConsultarMantenimientoRequestDTO, ConsultarMantenimientoResponseDTO>(request, url);
            if (response == null)
                throw new Exception(string.Format("Problemas con el servicio: {0}", url));

            return response;
        }

        public ConsultarActividadResponseDTO ConsultarActividad(ConsultarActividadRequestDTO request)
        {
            var url = ConfigurationManager.AppSettings["UrlConsultarActividad"];
            var response = DeserializarJSON<ConsultarActividadRequestDTO, ConsultarActividadResponseDTO>(request, url);
            if (response == null)
                throw new Exception(string.Format("Problemas con el servicio: {0}", url));

            return response;
        }
        public ConsultarMaterialResponseDTO ConsultarMaterial(ConsultarMaterialesRequestDTO request)
        {
            var url = ConfigurationManager.AppSettings["UrlConsultarMateriales"];
            var response = DeserializarJSON<ConsultarMaterialesRequestDTO, ConsultarMaterialResponseDTO>(request, url);
            if (response == null)
                throw new Exception(string.Format("Problemas con el servicio: {0}", url));

            return response;
        }
        public RegistrarFichaResponseDTO RegistrarFicha(RegistrarFichaRequestDTO request)
        {
            var url = ConfigurationManager.AppSettings["UrlRegistrarFicha"];
            var response = DeserializarJSON<RegistrarFichaRequestDTO, RegistrarFichaResponseDTO>(request, url);
            if (response == null)
                throw new Exception(string.Format("Problemas con el servicio: {0}", url));

            return response;
        }

        public ObtenerFichaResponseDTO ObtenerFicha(ObtenerFichaRequestDTO request)
        {
            var url = ConfigurationManager.AppSettings["UrlObtenerFicha"];
            var response = DeserializarJSON<ObtenerFichaRequestDTO, ObtenerFichaResponseDTO>(request, url);
            if (response == null)
                throw new Exception(string.Format("Problemas con el servicio: {0}", url));

            return response;
        }

    }
}