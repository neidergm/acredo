import { useEffect, useMemo } from "react";
import Heading from "../../components/Heading";
import { useAppSelector } from "../../hooks/useAppSelector";
import { isAdmin, isSupervisor } from "../../utils/userRolUtils";
import { useGetProcessTypesQuery, useGetProcessesQuery } from "../../services/api/process.api";
import ProcessKpis from "./components/ProcessKpis";
import ProcessFilters from "./components/ProcessFilters";
import ProcessList from "./components/ProcessList";
import { Container, Stack } from "react-bootstrap";
import ProcessCreationBtn from "./components/ProcessCreationBtn";
import { useSearchParams } from "react-router";
import classnames from "classnames";
import toast from "react-hot-toast";

export default function Process() {

    const userInfo = useAppSelector((s) => s.user.userInfo);
    const [searchParams] = useSearchParams()

    const { data: list = [], isLoading, isFetching } = useGetProcessesQuery({ status: searchParams.get("status") || undefined });
    const { data: types = [] } = useGetProcessTypesQuery();
    const canManage = !isSupervisor(userInfo?.rol) && isAdmin(userInfo?.rol);

    const filtered = useMemo(() => {
        const search = searchParams.get("search");
        const typeFilter = searchParams.get("type") ? Number(searchParams.get("type")) : null;

        const re = search ? new RegExp(search, "gi") : null;
        return list.filter((p) => {
            if (typeFilter !== null && p.id_tcond !== typeFilter) return false;
            if (!re) return true;
            return re.test(`${p.nomb_conv} ${p.cod_snies ?? ""} ${p.sede} ${p.programa ?? ""}`);
        });
    }, [searchParams, list]);

    useEffect(() => {
        const toastId = "process_list_update";
        if (!isLoading && isFetching) toast.loading("Consultando procesos...", { id: toastId, position: "bottom-center" });
        else toast.dismiss(toastId);
        return () => toast.dismiss(toastId);
    }, [isFetching, isLoading]);

    return (
        <Container fluid={"xxl"} >
            <Stack
                direction="horizontal"
                className="justify-content-between align-items-start mb-4"
            >
                <Heading>Procesos</Heading>
                {canManage && <ProcessCreationBtn />}
            </Stack>

            <ProcessKpis />

            <hr className="my-8 border-secondary border-opacity-50" />

            {!isLoading && <ProcessFilters types={types} totalCount={filtered.length} />}

            <div
                className={classnames("pt-8", { "opacity-50 pe-none": isFetching && !isLoading })}
                aria-busy={isFetching}
            >
                <ProcessList
                    processes={filtered}
                    canManage={canManage}
                />
            </div>
        </Container>
    );
}
