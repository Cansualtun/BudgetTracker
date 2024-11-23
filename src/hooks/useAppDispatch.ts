"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

import { useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState } from "@/store/store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
