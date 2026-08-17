import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "./DataTable";

interface Row {
  id: string;
  name: string;
}

const COLUMNS = [{ header: "Nome", cell: (row: Row) => row.name }];

describe("DataTable", () => {
  it("renders a header and a row per item", () => {
    render(
      <DataTable columns={COLUMNS} rows={[{ id: "1", name: "Survival" }]} getRowKey={(row) => row.id} />
    );
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Survival")).toBeInTheDocument();
  });

  it("renders the empty message when there are no rows", () => {
    render(<DataTable columns={COLUMNS} rows={[]} getRowKey={(row) => row.id} emptyMessage="Vuoto" />);
    expect(screen.getByText("Vuoto")).toBeInTheDocument();
  });
});
