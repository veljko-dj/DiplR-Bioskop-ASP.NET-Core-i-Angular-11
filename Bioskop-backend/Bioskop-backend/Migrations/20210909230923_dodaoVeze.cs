using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Bioskop_backend.Migrations
{
    public partial class dodaoVeze : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Movie",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    summary = table.Column<DateTime>(type: "datetime2", nullable: false),
                    trailer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    releaseDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    poster = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movie", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "moviesActors",
                columns: table => new
                {
                    actorId = table.Column<int>(type: "int", nullable: false),
                    movieId = table.Column<int>(type: "int", nullable: false),
                    character = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_moviesActors", x => new { x.actorId, x.movieId });
                    table.ForeignKey(
                        name: "FK_moviesActors_Actors_actorId",
                        column: x => x.actorId,
                        principalTable: "Actors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_moviesActors_Movie_movieId",
                        column: x => x.movieId,
                        principalTable: "Movie",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MoviesGenres",
                columns: table => new
                {
                    genreId = table.Column<int>(type: "int", nullable: false),
                    movieId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoviesGenres", x => new { x.genreId, x.movieId });
                    table.ForeignKey(
                        name: "FK_MoviesGenres_Genres_genreId",
                        column: x => x.genreId,
                        principalTable: "Genres",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MoviesGenres_Movie_movieId",
                        column: x => x.movieId,
                        principalTable: "Movie",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MoviesLocations",
                columns: table => new
                {
                    locationId = table.Column<int>(type: "int", nullable: false),
                    movieId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoviesLocations", x => new { x.locationId, x.movieId });
                    table.ForeignKey(
                        name: "FK_MoviesLocations_Locations_locationId",
                        column: x => x.locationId,
                        principalTable: "Locations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MoviesLocations_Movie_movieId",
                        column: x => x.movieId,
                        principalTable: "Movie",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_moviesActors_movieId",
                table: "moviesActors",
                column: "movieId");

            migrationBuilder.CreateIndex(
                name: "IX_MoviesGenres_movieId",
                table: "MoviesGenres",
                column: "movieId");

            migrationBuilder.CreateIndex(
                name: "IX_MoviesLocations_movieId",
                table: "MoviesLocations",
                column: "movieId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "moviesActors");

            migrationBuilder.DropTable(
                name: "MoviesGenres");

            migrationBuilder.DropTable(
                name: "MoviesLocations");

            migrationBuilder.DropTable(
                name: "Movie");
        }
    }
}
