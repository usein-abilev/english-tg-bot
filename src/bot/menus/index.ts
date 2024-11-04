import { Menu } from "@grammyjs/menu";
import { Composer } from "grammy";
import { localizeText } from "../localization";
import { BotContext } from "../session";
import dictionaryMenu, { DICTIONARY_MENU_ID, getDictionaryMenuText } from "./dictionary.menu";
import practiceMenu, {
    PRACTICE_MENU_ID,
    getPracticeMenuText,
    onCardRateCallbackQuery,
} from "./practice.menu";
import discoveryMenu, { DISCOVERY_MENU_ID, getDiscoveryMenuText } from "./discovery.menu";

const composer = new Composer<BotContext>();

export const MAIN_MENU_ID = "main";
const mainMenu = new Menu<BotContext>(MAIN_MENU_ID)
    .submenu(
        (ctx) => localizeText(ctx, "menu.start.buttons.discovery"),
        DISCOVERY_MENU_ID,
        async (ctx) => ctx.editMessageText(await getDiscoveryMenuText(ctx), { parse_mode: "HTML" }),
    )
    .row()
    .submenu(
        (ctx) => localizeText(ctx, "menu.start.buttons.practice"),
        PRACTICE_MENU_ID,
        async (ctx) => ctx.editMessageText(await getPracticeMenuText(ctx), { parse_mode: "HTML" }),
    )
    .submenu(
        (ctx) => localizeText(ctx, "menu.start.buttons.dictionary"),
        DICTIONARY_MENU_ID,
        async (ctx) =>
            ctx.editMessageText(await getDictionaryMenuText(ctx), { parse_mode: "HTML" }),
    );

mainMenu.register(practiceMenu);
mainMenu.register(dictionaryMenu);
mainMenu.register(discoveryMenu);

composer.use(mainMenu);
composer.callbackQuery(/card-rate-(\d)/, async (ctx) => {
    const rate = parseInt(ctx.match![1]);
    return onCardRateCallbackQuery(ctx, rate);
});

export { composer as menusComposer, mainMenu, practiceMenu };
