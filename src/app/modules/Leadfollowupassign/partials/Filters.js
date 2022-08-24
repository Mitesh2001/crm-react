import React from "react";
import { Form, Button, Card, Modal } from "react-bootstrap";
import SearchIcon from "@material-ui/icons/Search";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import jQuery from "jquery";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import Select from "react-select";

function Filters({ setQueryParams, setUserSelected }) {
  const selectInputRef = React.useRef();
  const selectInputRefRole = React.useRef();
  const [states, setStates] = React.useState([]);
  const formRef = React.useRef(null);
  const { addToast } = useToasts();

  const [casts, setCast] = React.useState([{ casts: "" }]);
  const [sendCastt, setCastRecord] = React.useState(false);
  const [CastConfirm, setCastConfirm] = React.useState(false);
  const [selectedCast, setCastSelected] = React.useState(null);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState(0);
  const [selectedRole, setSelectedRole] = React.useState(0);
  const [list, setList] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [rolesUser, setRolesUser] = React.useState("");

  const postUsers = React.useCallback((cid) => {
    if (cid) {
      Actions.users({ role_id: cid }).then((data) => {
        if (data.status === "SUCCESS") {
          setUsers(data.data.employees);
        }
      });
    }
  }, []);

  React.useEffect(postUsers, []);

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
    setSelectedRole(event.target.value);
    setCurrentPage(1);
    //getData();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    setQueryParams(formDataObj);
  };

  const resetForm = () => {
    formRef.current.reset();
    selectInputRef.current.select.clearValue();
    selectInputRefRole.current.select.clearValue();
    setStates([]);
    setQueryParams({});
  };

  const getRoles = React.useCallback(() => {
    Actions.roles().then((data) => {
      if (data.status === "SUCCESS") {
        setRoles(data.data.roles);
      }
    });
  }, []);
  React.useEffect(getRoles, []);

  /* if (value == '3') {
        jQuery('#assign').hide();
    } */
  const formatLabel = ({ name, id, designation }) => (
    <div style={{ display: "flex" }}>{name}</div>
  );
  const formatOptionLabel = ({ name, id, designation }) => (
    <div style={{ display: "flex" }}>
      ({id}) {name} {designation ? "(" + designation + ")" : null}
    </div>
  );

  const handleUser = (e) => {
    setUserSelected(e)
    if (e) setQueryParams({ roles: rolesUser, users: e.id });
  };
  return (
    <>
      <Form noValidate onSubmit={handleSubmit} ref={formRef}>
        <div className="row pt-5">
          <div className="col-sm-12">
            <div className="row" style={{marginLeft: '-5px' }}>
              <div className="col-sm-3" id="assign">
                <Form.Group>
                  <Form.Label>
                    Roles<span className="text-danger">*</span>
                  </Form.Label>
                  <Select
                    ref={selectInputRefRole}
                    className="basic-single tele-drop"
                    classNamePrefix="select"
                    onChange={(e) => {
                      if (e) {
                        setRolesUser(e.id);
                        selectInputRef.current.select.clearValue();
                        postUsers(e.id);
                      }
                    }}
                    name="roles"
                    closeMenuOnSelect={true}
                    placeholder={"Select Role"}
                    isSearchable={true}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    formatOptionLabel={formatLabel}
                    options={roles}
                  />

                  <Form.Control.Feedback type="invalid">
                    Please select lead stage
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>
                    {" "}
                    Users<span className="text-danger">*</span>
                  </Form.Label>
                  <Select
                    ref={selectInputRef}
                    className="basic-single tele-drop"
                    classNamePrefix="select"
                    name="users"
                    closeMenuOnSelect={true}
                    placeholder={"Select User"}
                    isSearchable={true}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    formatOptionLabel={formatOptionLabel}
                    options={users}
                    onChange={(e) => {
                      handleUser(e);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select user
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-3 mt-9">
                <Button
                  variant="danger"
                  size="sm"
                  className="rk-btn-icon"
                  onClick={resetForm}
                  disabled={loading}
                >
                  <RotateLeftIcon />
                  &nbsp;Reset
                </Button>
              </div>
            </div>
          </div>
          {/* <div className="col-md-12 text-center"> */}
          {/* <Button
              variant="primary"
              className="rk-btn rk-btn-icon"
              size="sm"
              type="submit"
              disabled={loading}
            >
              <SearchIcon />
              &nbsp;{loading ? "Loading.." : "Search"}
            </Button>
            &nbsp; */}
          {/* <Button
              variant="danger"
              size="sm"
              className="rk-btn-icon"
              onClick={resetForm}
              disabled={loading}
            >
              <RotateLeftIcon />
              &nbsp;Reset
            </Button>
            &nbsp; */}
          {/*<Button variant="primary" className="rk-btn rk-btn-icon" size="sm" onClick={exportContacts}><SystemUpdateAltIcon />&nbsp;Export</Button>*/}
          {/* </div> */}
        </div>
      </Form>
    </>
  );
}

export default React.memo(Filters);
