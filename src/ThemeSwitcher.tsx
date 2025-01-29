import { Switch, FormControlLabel } from "@mui/material";

export default function ThemeSwitcher({ isLightMode, setIsLightMode }: { isLightMode: boolean; setIsLightMode: (value: boolean) => void }) {
    return (
        <FormControlLabel
            className="light-switch"
            control={
                <Switch
                    checked={isLightMode}
                    onChange={() => setIsLightMode(!isLightMode)}
                />
            }
            label={isLightMode ? "Light Mode" : "Dark Mode"}
        />
    );
}
