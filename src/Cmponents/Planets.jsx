import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
const Planets = () => {
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [residents, setResidents] = useState([]);
  const [fetchingResidents, setFetchingResidents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageCounter, setPageCounter] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`https://swapi.dev/api/planets/?format=json&page=${pageCounter}`)
      .then((response) => response.json())
      .then((data) => {
        setPlanets(data.results);
        setTimeout(() => setLoading(false), 150);
      })
      .catch((error) => {
        console.error("Error fetching planets:", error);
        setLoading(false);
      });
  }, [pageCounter]);

  useEffect(() => {
    if (selectedPlanet) {
      setFetchingResidents(true);
      fetchResidents(selectedPlanet.residents);
    }
  }, [selectedPlanet]);

  useEffect(() => {
    if (fetchingResidents) {
      setFetchingResidents(false);
    }
  }, [fetchingResidents]);

  const fetchResidents = (residentUrls) => {
    Promise.all(
      residentUrls.map((url) => fetch(url).then((response) => response.json()))
    )
      .then((residentData) => setResidents(residentData))
      .catch((error) => console.error("Error fetching residents:", error));
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (planet) => {
    setSelectedPlanet(planet);
    setOpenModal(true);
    setFetchingResidents(true);
    fetchResidents(planet.residents);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container className="my-4 " style={{ fontFamily: "Josefin Sans" }}>
      <h1 className="text-center mb-4">Star Wars Planets Directory</h1>
      {loading ? (
        <div className="d-flex align-items-center gap-3">
          <p className="fs-4">Loading...</p>
          <Spinner
            animation="border"
            role="status"
            className="mb-2 "
            style={{ color: "#ed6c02" }}
          >
            <span className="visually-hidden ">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row className="mb-5">
          {planets.slice(0, 9).map((planet) => (
            <Col key={planet.name} lg={4} md={6} sm={12}>
              <Card
                className="my-3 "
                style={{ borderRadius: "18px", height: "300px" }}
              >
                <Card.Body
                  className="m-2"
                  style={{ background: "#ffedec", borderRadius: "12px" }}
                >
                  <Card.Title className="d-flex " style={{ color: "#ed6c02" }}>
                    {" "}
                    <p style={{ color: "#744c40" }}>
                      {" "}
                      Planets Name -{" "}
                    </p> &nbsp; {planet.name}
                  </Card.Title>

                  <Card.Text className="d-flex" style={{ color: "#ed6c02" }}>
                    {" "}
                    <p style={{ color: "#744c40" }}>Climate : </p> &nbsp;{" "}
                    {planet.climate}
                  </Card.Text>
                  <Card.Text className="d-flex" style={{ color: "#ed6c02" }}>
                    {" "}
                    <p style={{ color: "#744c40" }}>
                      Population :{" "}
                    </p> &nbsp; {planet.population}
                  </Card.Text>
                  <Card.Text
                    className="d-flex"
                    style={{
                      color: "#ed6c02",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <p style={{ color: "#744c40" }}>Terrain: </p>&nbsp;{" "}
                    {planet.terrain}
                  </Card.Text>

                  {planet.residents.length > 0 ? (
                    <div>
                      {/* Load Residents button now opens a modal */}
                      <Button
                        variant="primary"
                        onClick={() => handleOpenModal(planet)}
                        style={{ background: "#ed6c02" }}
                        fullWidth
                        className="fw-bold text-white rounded-3"
                      >
                        Load Residents
                      </Button>

                      {/* Modal to display resident details */}
                      <Dialog
                        open={openModal}
                        onClose={handleCloseModal}
                        fullWidth
                      >
                        <DialogTitle className="d-flex align-items-center justify-content-between">
                          <div>{selectedPlanet?.name} Residents </div>
                          <Button
                            variant="outlined"
                            color="warning"
                            className="rounded-3 "
                            size="small"
                            onClick={handleCloseModal}
                          >
                            Close
                          </Button>
                        </DialogTitle>
                        <DialogContent>
                          {fetchingResidents ? (
                            <p>Loading residents...</p>
                          ) : residents.length > 0 ? (
                            <ul>
                              {residents.map((resident) => (
                                <li key={resident.name}>
                                  {resident.name} - {resident.height}cm,{" "}
                                  {resident.mass}kg, {resident.gender}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No data available</p>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <p className="mb-1 text-danger fs-5">
                      No Residents available
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Stack
        spacing={5}
        className="position-fixed bottom-0 start-50 translate-middle-x mb-3 shadow-lg p-2 rounded-5 "
        direction="row"
        justifyContent="center"
        style={{
          background: "white",
          width: window.innerWidth <= 768 ? "90%" : "",
        }}
      >
        <Pagination
          count={6}
          page={pageCounter}
          onChange={(event, value) => setPageCounter(value)}
          color="warning"
          style={{ width: "100%" }}
          className="d-flex justify-content-center"
        />
      </Stack>
    </Container>
  );
};

export default Planets;
