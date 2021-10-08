using Microsoft.EntityFrameworkCore.Migrations;

namespace Bioskop_backend.Migrations
{
    public partial class NeZnamKakoJeDosloDoOveGlupeGreskeZameneGenreILokacije : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "name",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "x",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "y",
                table: "Genres");

            migrationBuilder.AddColumn<int>(
                name: "x",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "y",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "Genres",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "x",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "y",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "name",
                table: "Genres");

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "x",
                table: "Genres",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "y",
                table: "Genres",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
