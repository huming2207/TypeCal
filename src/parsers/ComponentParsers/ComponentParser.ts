import { ComponentType } from '../../components/Component';

export abstract class ComponentParser<T> {
    abstract parseComponent(rawStr: string): T;
    public static findComponents = (rawStr: string, type: ComponentType): string[] => {
        let beginIndex = 0;
        let endIndex = 0;
        const beginStr = `BEGIN:${type}`;
        const endStr = `END:${type}`;
        const rawComponents: string[] = [];

        while (beginIndex != -1 && endIndex != -1) {
            beginIndex = rawStr.indexOf(beginStr, beginIndex + 1) + beginStr.length;
            endIndex = rawStr.indexOf(endStr, endIndex + 1);
            rawComponents.push(rawStr.substring(beginIndex + 1, endIndex));
        }

        return rawComponents;
    };
}
