import { useDetail } from "../pages/service/query/useDetail";
import { ClassmateForm } from "./classmates-form";
import { Spinner } from "./ui/spinner";

export const ClassmateFormWrapper = ({
    id,
    closeEditModal,
}: {
    id: string;
    closeEditModal: () => void;
}) => {
    const { data, isLoading } = useDetail(id);

    return (
        <div>
            {isLoading ? (
                <Spinner />
            ) : (
                <ClassmateForm
                    closeModal={closeEditModal}
                    classmateId={id}
                    defaultValueData={data}
                />
            )}
        </div>
    );
};
