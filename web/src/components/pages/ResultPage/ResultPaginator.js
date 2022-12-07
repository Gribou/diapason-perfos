import React from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination, PaginationItem } from "@mui/material";

export default function ResultPaginator({ count, pageSize }) {
  const [params, push] = useSearchParams();
  const page = params.get("page");

  const goToPage = (p) => {
    params.set("page", p);
    push(params);
  };

  const nb_pages = () => Math.floor((count - 1) / pageSize) + 1;

  return (
    <Pagination
      count={nb_pages()}
      page={parseInt(page, 10) || 1}
      sx={{
        mt: 2,
        ml: "auto",
        display: nb_pages() > 1 ? "block" : "none",
      }}
      onChange={(e, value) => goToPage(value)}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          variant={item.selected ? "outlined" : "text"}
        />
      )}
    />
  );
}
