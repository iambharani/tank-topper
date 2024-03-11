import React from 'react';
import { Card, Image } from 'semantic-ui-react';

const UserProfile = ({ user }) => (
  <Card>
    <Image src={user.avatarUrl} wrapped ui={false} />
    <Card.Content>
      <Card.Header>{user.name}</Card.Header>
      <Card.Meta>{user.email}</Card.Meta>
      <Card.Description>
        User bio here.
      </Card.Description>
    </Card.Content>
  </Card>
);

export default UserProfile;
