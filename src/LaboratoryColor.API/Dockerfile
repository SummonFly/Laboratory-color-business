FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["src/LaboratoryColor.Domain/LaboratoryColor.Domain.csproj", "src/LaboratoryColor.Domain/"]
COPY ["src/LaboratoryColor.Application/LaboratoryColor.Application.csproj", "src/LaboratoryColor.Application/"]
COPY ["src/LaboratoryColor.Infrastructure/LaboratoryColor.Infrastructure.csproj", "src/LaboratoryColor.Infrastructure/"]
COPY ["src/LaboratoryColor.API/LaboratoryColor.API.csproj", "src/LaboratoryColor.API/"]

RUN dotnet restore "src/LaboratoryColor.API/LaboratoryColor.API.csproj"

COPY . .

WORKDIR "/src/src/LaboratoryColor.API"
RUN dotnet build "./LaboratoryColor.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./LaboratoryColor.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LaboratoryColor.API.dll"]