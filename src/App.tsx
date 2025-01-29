import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Container, TextField, Button, FormControl } from "@mui/material";
import "./App.scss";
import BoxGeometry from "./Cube";

export default function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [dimensions, setDimensions] = useState({ length: 100, width: 100, height: 100 });
  const [geometryData, setGeometryData] = useState<{ vertices: number[]; triangles: number[] } | null>(null);

  useEffect(() => {
    fetchBoxData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (value === "") {
      setDimensions((prev) => ({ ...prev, [name]: "" }));
    } else {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue) && parsedValue >= 1) {
        setDimensions((prev) => ({ ...prev, [name]: parsedValue }));
      }
    }
  };  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchBoxData();
  };

  const fetchBoxData = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          length: dimensions.length / 100,
          width: dimensions.width / 100,
          height: dimensions.height / 100,
        }),
      });

      if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`);

      const data = await response.json();

      if (!data.vertices || !Array.isArray(data.vertices) || !data.triangles || !Array.isArray(data.triangles)) {
        throw new Error("Некорректный ответ сервера");
      }

      setGeometryData({ vertices: data.vertices.flat(), triangles: data.triangles.flat() });
    } catch (error) {
      console.error("Ошибка запроса к серверу:", error);
    }
  };

  return (
    <>
      <Container className="ui-container">
        <h1 className="ui-title">3D Box Configurator</h1>
        <FormControl component="form" onSubmit={handleSubmit} className="ui-form" fullWidth>
            <TextField
              className="ui-input"
              label="Length"
              name="length"
              type="number"
              value={dimensions.length}
              onChange={handleChange}
            />
            <TextField
              className="ui-input"
              label="Width"
              name="width"
              type="number"
              value={dimensions.width}
              onChange={handleChange}
            />
            <TextField
              className="ui-input"
              label="Height"
              name="height"
              type="number"
              value={dimensions.height}
              onChange={handleChange}
            />
            <Button className="ui-button" variant="contained" color="primary" type="submit" fullWidth>
              Update Box
            </Button>
        </FormControl>
      </Container>

      <Container className="canvas-container">
        <Canvas className="canvas" shadows>
          <pointLight position={[0, 3, 0]} intensity={0.5} />
          <hemisphereLight color={"#ffffff"} groundColor={"#444444"} intensity={0.6} />
          <ambientLight intensity={0.5} />
          {geometryData && <BoxGeometry vertices={geometryData.vertices} triangles={geometryData.triangles} />}
        </Canvas>
      </Container>
    </>
  );
}