import style from "./page.module.css";
import Select from "../components/Select"
function Page() {
  return (
    <section className="container-fluid">
      <div className={`${style.main} row`}>
        {/* Sección 1 */}
        <div className="col-6"></div>

        {/* Sección 2 */}
        <div className="col-6 d-flex justify-content-center align-items-center border-danger">
          <div
            className={`${style.formulario}`}
          >
            <Select/>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;
