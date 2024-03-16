import React from 'react';
import { Modal, Form, Button, Image, Icon } from 'semantic-ui-react';

function EditProfileModal({ openEditProfileModal, setOpenEditProfileModal, userData, handleFileChange, handleUserFormChange, handleEditUser }) {
  return (
    <Modal
      open={openEditProfileModal}
      onClose={() => setOpenEditProfileModal(false)}
      size="tiny"
      className="custom-modal"
    >
      <Modal.Header>Edit Profile</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <div className="image-upload-container">
              <Image
                bordered
                circular
                spaced
                verticalAlign="middle"
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
                centered
                src={userData.userImage || "default_profile_image_url"}
                size="small"
                className="customCircularImage"
              />
              <div className="upload-icon">
                <Icon name="upload" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>

            <label>Username</label>
            <input
              placeholder="Username"
              name="username"
              value={userData.username}
              onChange={handleUserFormChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={handleUserFormChange}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpenEditProfileModal(false)}>
          Cancel
        </Button>
        <Button
          content="Save"
          labelPosition="right"
          icon="checkmark"
          onClick={handleEditUser}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default EditProfileModal;
