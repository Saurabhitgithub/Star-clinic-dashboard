import { useLocation } from "react-router";

export function useQueryParams(key) {
    return new URLSearchParams(useLocation().search).get(key);
}