import React, { useState, useEffect } from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import mqtt from "mqtt";

const SmartPitMonitoring = () => {
  const [pitData, setPitData] = useState([]);

  useEffect(() => {
    // Connect to the MQTT broker
    const client = mqtt.connect("wss://test.mosquitto.org:8081");

    // Subscribe to the topic
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("iot/smartcover/data");
    });

    // Handle incoming messages
    client.on("message", (topic, message) => {
      if (topic === "iot/smartcover/data") {
        const data = JSON.parse(message.toString());
        setPitData((prevData) => {
          // Update the table data dynamically
          const existingIndex = prevData.findIndex((item) => item.uid === data.uid);
          if (existingIndex !== -1) {
            const updatedData = [...prevData];
            updatedData[existingIndex] = data;
            return updatedData;
          } else {
            return [...prevData, data];
          }
        });
      }
    });

    // Cleanup on component unmount
    return () => {
      client.end();
    };
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Smart Pit Monitoring</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">UID</th>
                    <th scope="col">Status</th>
                    <th scope="col">Timestamp</th>
                    <th scope="col">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Hardcoded row with sample values */}
                  <tr>
                    <th scope="row">PIT001</th>
                    <td>
                      <Badge color="" className="badge-dot mr-4 bg-success">
                        Access granted
                      </Badge>
                    </td>
                    <td>2025-04-08 12:00:00</td>
                    <td>13.06, 80.23</td>
                  </tr>
                  {/* Dynamic rows from MQTT */}
                  {pitData.map((pit) => (
                    <tr key={pit.uid}>
                      <th scope="row">{pit.uid}</th>
                      <td>
                        <Badge
                          color=""
                          className={`badge-dot mr-4 ${
                            pit.status === "Access granted"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {pit.status}
                        </Badge>
                      </td>
                      <td>{pit.timestamp}</td>
                      <td>{pit.location}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default SmartPitMonitoring;