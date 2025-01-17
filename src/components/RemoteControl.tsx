import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Box, Fab } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import WbSunnyIcon from "@material-ui/icons/WbSunny";

import { green } from "@material-ui/core/colors";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  decreaseTemperature,
  increaseTemperature,
  setMode,
  toggleStatus,
} from "../features/ac/acSlice";
import { RootState } from "../app/store";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

/**
 * 遥控器按钮
 * @param props
 */
function RCButton(props: any) {
  const ac = useAppSelector((state: RootState) => state.ac);
  return (
    <Fab
      {...props}
      onClick={() => {
        if (props["aria-label"] !== "add" && !ac.status) return;
        playDi();
        props.onClick();
      }}
    ></Fab>
  );
}

/**
 * 播放「嘀」的音效
 */
function playDi() {
  const di = document.getElementById("di");
  if (di) {
    (di as HTMLAudioElement).play();
  }
}

/**
 * 播放工作声音
 */
function playWorkSound() {
  const acWork = document.getElementById("ac-work") as HTMLAudioElement;
  acWork.load();
  acWork.play();
}

/**
 * 切换空调工作状态
 * @param {*} props
 */
function toggleAC(status: boolean, dispatch: any) {
  if (status) {
    (document.getElementById("ac-work") as HTMLAudioElement).load();
  } else {
    playWorkSound();
  }

  dispatch(toggleStatus());
}

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const jsdelivrCDN =
  "https://cdn.jsdelivr.net/gh/YunYouJun/air-conditioner/public";

const SOUND_DI_PATH =
  (process.env.NODE_ENV === "production"
    ? jsdelivrCDN
    : process.env.PUBLIC_URL) + "/assets/audio/di.mp3";

const SOUND_AC_WORK_PATH =
  (process.env.NODE_ENV === "production"
    ? jsdelivrCDN
    : process.env.PUBLIC_URL) + "/assets/audio/ac-work.mp3";

/**
 * 遥控
 * @param {*} props
 */
export default function RemoteControl() {
  const classes = useStyles();
  const ac = useAppSelector((state: RootState) => state.ac);
  const dispatch = useAppDispatch();
  return (
    <Box my={4} display="flex" flexDirection="column" alignItems="center">
      <audio id="di" src={SOUND_DI_PATH} preload="auto"></audio>
      <audio id="ac-work" src={SOUND_AC_WORK_PATH} preload="auto"></audio>
      <div>
        {" "}
        <RCButton
          color="primary"
          aria-label="cold"
          className={classes.margin}
          onClick={() => {
            dispatch(setMode("cold"));
          }}
        >
          <AcUnitIcon />
        </RCButton>
        <ThemeProvider theme={theme}>
          <RCButton
            color={ac.status ? "secondary" : "primary"}
            aria-label="add"
            className={classes.margin}
            onClick={() => {
              toggleAC(ac.status, dispatch);
            }}
            style={{ color: "white" }}
          >
            <PowerSettingsNewIcon />
          </RCButton>
        </ThemeProvider>
        <RCButton
          aria-label="hot"
          className={classes.margin}
          style={{ backgroundColor: "orange", color: "white" }}
          onClick={() => {
            dispatch(setMode("hot"));
          }}
        >
          <WbSunnyIcon />
        </RCButton>
      </div>
      <RCButton
        aria-label="add"
        className={classes.margin}
        onClick={() => {
          dispatch(increaseTemperature());
        }}
      >
        <ExpandLessIcon />
      </RCButton>
      <RCButton
        aria-label="reduce"
        className={classes.margin}
        onClick={() => {
          dispatch(decreaseTemperature());
        }}
      >
        <ExpandMoreIcon />
      </RCButton>
    </Box>
  );
}
