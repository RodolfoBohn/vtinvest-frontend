import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage } from "../utils/localstorage";
import useGlobalUser from "./use-global-user";

function getMsgFromErro(erro) {
  return erro?.response?.data?.message
}

export function useErro(val) {
  const [, setUsuario] = useGlobalUser()
  const [erro, _setErro] = useState(val)
  const navigate = useNavigate()

  function setErro(erro) {
    if (erro?.response?.status === 401 || erro?.response?.status === 403) {
      setUsuario({});
      clearLocalStorage();
      navigate("/");
    } else {
      _setErro(getMsgFromErro(erro) || erro.message);
      setTimeout(() => {
        _setErro("");
      }, 2000);
    }
  }
  return [erro, setErro];
}
