import React from 'react';
import { Badge, UncontrolledTooltip } from 'reactstrap';

const PitData = ({ pits }) => {
  return (
    <>
      {pits.map((pit, index) => (
        <tr key={index}>
          <th scope="row">{pit.id}</th>
          <td>{pit.location}</td>
          <td>
            <Badge color={pit.status === 'Open' ? 'danger' : 'success'} pill>
              {pit.status}
            </Badge>
          </td>
        </tr>
      ))}
    </>
  );
};

export default PitData;
