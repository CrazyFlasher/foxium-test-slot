import {
    AbstractHierarchyObject,
    IHierarchyObject,
    IHierarchyObjectImmutable,
    MessageType,
    setDefaultImplementation
} from "domwires";
import {ProjectTypes} from "../common/ProjectTypes";

export class LocaleModelMessageType extends MessageType
{
    public static readonly LOCALE_CHANGED: LocaleModelMessageType = new LocaleModelMessageType();
}

export interface ITextsModelImmutable extends IHierarchyObjectImmutable
{
    get(key: string): string;
}

export interface ITextsModel extends ITextsModelImmutable, IHierarchyObject
{
    set localeCode(value: string);

    fromCsv(csv: string): ITextsModel;
}

class TextsModel extends AbstractHierarchyObject implements ITextsModel
{
    private localeMaps!: Map<string, Map<string, string>>;
    private _localeCodes!: string[];
    private _currentLocaleCode!: string;

    public fromCsv(csv: string): ITextsModel
    {
        this._localeCodes = [];
        this.localeMaps = new Map();

        const splitter = "\r\n";

        const rows: string[] = csv.split(splitter);
        this._localeCodes = this.getLocaleCodes(rows[0]);

        let j = 0;
        while (j < this._localeCodes.length)
        {
            const localeMap = new Map<string, string>();

            let i = 1;
            while (i < rows.length - 1)
            {
                const row: string = rows[i];
                const r: string[] = row.split(';');

                localeMap.set(r[0], r[j + 1].split("<br>").join("\n"));

                i++;
            }

            this.localeMaps.set(this._localeCodes[j], localeMap);
            j++;
        }

        this._currentLocaleCode = this._localeCodes[0];

        const forcedLocaleCode = new URLSearchParams(window.location.search).get("lang");
        if (forcedLocaleCode)
        {
            this.localeCode = forcedLocaleCode;
        }

        return this;
    }

    private getLocaleCodes(r: string): string[]
    {
        const row: string = r.substring(1, r.length);

        return row.split(";");
    }

    public get(key: string): string
    {
        const text = this.localeMaps.get(this._currentLocaleCode)!.get(key);
        if (!text)
        {
            this.warn("WARNING: missing locale key: " + key);
        }

        return text ? text : "";
    }

    public set localeCode(value: string)
    {
        if (this.containsCode(value))
        {
            if (value != this._currentLocaleCode)
            {
                this._currentLocaleCode = value;

                this.dispatchMessage(LocaleModelMessageType.LOCALE_CHANGED);
            }
        }
        else
        {
            this.warn("Warning: invalid locale code: " + value);
        }
    }

    private containsCode(code: string): boolean
    {
        for (const localeCode of this._localeCodes)
        {
            if (localeCode == code)
            {
                return true;
            }
        }

        return false;
    }
}

setDefaultImplementation<ITextsModel>(ProjectTypes.ITextModel, TextsModel);