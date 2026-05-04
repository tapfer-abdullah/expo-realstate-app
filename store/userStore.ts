import { create } from "zustand";

type Store = {
  allCountries: any[];
  setAllCountries: (countries: any[]) => void;
  savedCountries: any[];
  setSavedCountries: (countries: any[]) => void;
};

export const useCountryStore = create<Store>()((set) => ({
  allCountries: [],
  setAllCountries: (countries) => set({ allCountries: countries }),
  savedCountries: [],
  setSavedCountries: (countries) => set({ savedCountries: countries }),
}));
