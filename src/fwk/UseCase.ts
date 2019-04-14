import reduce = require("lodash/reduce");
type Provider<TPContext> = (state: TPContext) => (TPContext) | Promise<TPContext>;
export class UseCase<TContext> {
    private _providers: Provider<TContext>[] = [];
    constructor(providers?: Provider<TContext>[] ) {
        this._providers = this._providers.concat(providers);
    }


    public with(useCaseOrProvider: UseCase<TContext>): UseCase<TContext>;
    public with(...providers: Provider<TContext>[]): UseCase<TContext>;
    public with(...providers: any[]): UseCase<TContext> {
        const useCaseOrProvider = providers[0];
        if (useCaseOrProvider instanceof UseCase) {
            return new UseCase<TContext>(this._providers.concat(useCaseOrProvider.providers));
        }
        return new UseCase<TContext>(this._providers.concat(providers));
    }
    public get providers(): Provider<TContext>[] {
        return this._providers;
    }
    public exec( initialState: TContext ): Promise<TContext> {
        return reduce(this._providers, async (state, provider) => {
            const previousState = await state;
            return await provider(previousState);
        }, Promise.resolve(initialState));
    }


}

export const createUseCase = <TContext>(...providers: Provider<TContext>[]) => new UseCase<TContext>(providers);