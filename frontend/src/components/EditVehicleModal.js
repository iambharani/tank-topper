import React from 'react';
import { Modal, Form, Dropdown, Button } from 'semantic-ui-react';

function EditVehicleModal({ openEditModal, setOpenEditModal, editVehicleData, handleFormChange, handleSaveVehicle, fuelTypeOptions }) {
  return (
    <Modal
      open={openEditModal}
      onClose={() => setOpenEditModal(false)}
      size="tiny"
      className="custom-modal"
    >
      <Modal.Header className="custom-modal-header">Edit Vehicle</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Vehicle Number</label>
            <input
              placeholder="Vehicle Number"
              name="vehicleNumber"
              value={editVehicleData?.vehicleNumber || ""}
              onChange={handleFormChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Fuel Type</label>
            <Dropdown
              placeholder="Select Fuel Type"
              fluid
              selection
              options={fuelTypeOptions}
              name="fuelType"
              value={editVehicleData?.fuelType || ""}
              onChange={(e, { name, value }) =>
                handleFormChange({ target: { name, value } })
              }
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions className="custom-modal-actions">
        <Button className="custom-modal-button" color="black" onClick={() => setOpenEditModal(false)}>
          Cancel
        </Button>
        <Button className="custom-modal-button"
          content="Save"
          labelPosition="right"
          icon="checkmark"
          onClick={handleSaveVehicle}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default EditVehicleModal;
