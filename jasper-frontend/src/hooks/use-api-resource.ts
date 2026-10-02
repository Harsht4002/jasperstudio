"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiResult } from "@/types/api";

export function useApiResource<T>(
  load: () => Promise<T>,
  isEmpty: (data: T) => boolean = () => false
) {
  const [result, setResult] = useState<ApiResult<T>>({ status: "loading" });

  const refetch = useCallback(() => {
    setResult({ status: "loading" });

    load()
      .then((data) => {
        setResult(isEmpty(data) ? { status: "empty", data } : { status: "success", data });
      })
      .catch((error: unknown) => {
        setResult({
          status: "error",
          error: error instanceof Error ? error : new Error("Something went wrong")
        });
      });
  }, [isEmpty, load]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { result, refetch };
}
