using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Bioskop_backend.Migrations
{
    public partial class popravkaMovie : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "order",
                table: "moviesActors");

            migrationBuilder.RenameColumn(
                name: "poster",
                table: "Movie",
                newName: "posterString");

            migrationBuilder.AlterColumn<string>(
                name: "summary",
                table: "Movie",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "posterString",
                table: "Movie",
                newName: "poster");

            migrationBuilder.AddColumn<int>(
                name: "order",
                table: "moviesActors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "summary",
                table: "Movie",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
