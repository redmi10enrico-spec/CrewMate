import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";
import { Card } from "./Card";
import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";

describe("Card", () => {
  it("renders title and children", () => {
    render(<Card title="Survival">Sopravvivi ed esplora</Card>);
    expect(screen.getByText("Survival")).toBeInTheDocument();
    expect(screen.getByText("Sopravvivi ed esplora")).toBeInTheDocument();
  });
});

describe("Container", () => {
  it("renders children inside a max-width wrapper", () => {
    render(<Container>contenuto</Container>);
    expect(screen.getByText("contenuto").className).toContain("max-w-site");
  });
});

describe("SectionTitle", () => {
  it("renders title and optional subtitle", () => {
    render(<SectionTitle subtitle="Sottotitolo">Titolo</SectionTitle>);
    expect(screen.getByText("Titolo")).toBeInTheDocument();
    expect(screen.getByText("Sottotitolo")).toBeInTheDocument();
  });
});

describe("Badge", () => {
  it("applies tone classes", () => {
    render(<Badge tone="danger">Offline</Badge>);
    expect(screen.getByText("Offline").className).toContain("text-danger");
  });
});
