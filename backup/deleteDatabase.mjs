import { deleteDatabase } from "../store/indexedDBStore.mjs";
import { showToast } from "../shared/toast/toast.component.mjs";

const deleteDB = () => {
  if (
    window.confirm("Souhaitez-vous vraiment supprimer la base de données ?")
  ) {
    deleteDatabase().then(() => {
      showToast("Base de données supprimée ✅");
    });
  }
};

export default deleteDB;
