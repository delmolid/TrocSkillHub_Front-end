import React from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useDeleteProfilUser } from "@/hooks/useUserQuery";
import { useToast, TOAST_SEVERITY } from "@/context/ToastContext";

interface ProfileDeleteModalProps {
  visible: boolean;
  onHide: () => void;
}

export const ProfileDeleteModal: React.FC<ProfileDeleteModalProps> = ({
  visible,
  onHide,
}) => {
  const { mutate: deleteProfil } = useDeleteProfilUser();
//   const { showToast } = useToast();

  const accept = () => {
    onHide();
    deleteProfil();
  };

  const reject = () => {
    showToast({
      severity: "info",
      summary: "Annulé",
      detail: "Suppression annulée.",
      life: 3000,
      className: `rounded-lg border-l-4 shadow-md font-sans ${TOAST_SEVERITY.info}`,
      contentClassName: "flex items-center gap-3 px-3.5 py-3",
    });
    onHide();
  };

  return (
    <ConfirmDialog
      visible={visible}
      onHide={onHide}
      message="Voulez-vous vraiment supprimer votre profil ?"
      header="Confirmation de suppression"
      icon="pi pi-exclamation-triangle"
      accept={accept}
      reject={reject}
      style={{ width: "50vw" }}
      breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
      pt={{
        root:        { className: "rounded-xl shadow-xl border border-[#176b87]/20 bg-[#fafbf9] font-sans" },
        header:      { className: "flex items-center px-6 pt-5 pb-3 border-b border-[#176b87]/15" },
        headerTitle: { className: "text-base font-bold text-[#060605]" },
        content:     { className: "flex items-start gap-3 px-6 py-5 text-sm text-[#060605]" },
        icon:        { className: "text-[#70744f] text-xl shrink-0" },
        message:     { className: "leading-relaxed" },
        footer:      { className: "flex justify-end gap-2 px-6 pb-5 pt-2" },
        acceptButton: { className: "px-4 py-2 rounded-full bg-[#70744f]/20 text-white text-sm font-bold hover:bg-red-400" },
        rejectButton: { className: "px-4 py-2 rounded-full bg-[#70744f]/10 text-[#70744f] text-sm font-medium" },
        closeButton:  { className: "ml-auto text-[#060605]/40 hover:text-[#060605] transition-opacity" },
      }}
    />
  );
};
